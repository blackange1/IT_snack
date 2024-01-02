from django.shortcuts import render, get_object_or_404

# Create your views here.

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .serializers import CourseSerializer, \
    CourseDetailSerializer, ModuleSerializer, LessonSerializer
from course.models import Course, Module
from lesson.models import Lesson
from step.models import STEP_LIST, LESSON_METHODS, Text, Choice
from progress.models import get_step_progres, ProgressText, ProgressChoice

error = Response({
    'status': 'error'
})


class CourseList(APIView):
    def get(self, request):
        courses = Course.objects.all()[:20]
        data = CourseSerializer(courses, many=True).data
        return Response(data)


class CourseDetail(APIView):
    # serializer_class = CourseSerializer
    def get(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        data = CourseDetailSerializer(course).data
        return Response(data)


class ModuleDetail(APIView):
    def get(self, request, module_id):
        course = get_object_or_404(Module, pk=module_id)
        data = ModuleSerializer(course).data
        print(data)
        return Response(data)


class StepMenu(APIView):
    def get(self, request, lesson_id):
        data = []
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        user = request.user
        for attribute in LESSON_METHODS:
            for item in lesson.__getattribute__(attribute).all():
                # print('item', dir(item))
                print('item', item.TYPE)
                data_item = {
                    'order': item.order,
                    'type': item.TYPE,
                    'id': item.id,
                    'points': item.get_points(user),
                    # 'points': get_step_progres(item.TYPE, item, request.user),
                }
                if item.TYPE == 'choice':
                    data_item.update({'solved': item.get_solved(user=user)})
                data.append(data_item)
                # print(item.TYPE, item.order, item.id)

        data.sort(key=lambda x: x.get('order'))
        return Response(data)


# class StepItem(APIView):
#     def get(self, request, step_type, step_id):
#         # print(step_type, step_id)
#         class_step = STEP_LIST.get(step_type, None)
#         data = {}
#         if not class_step:
#             print(class_step)
#             return Response({
#                 'status': 'error',
#             })
#         if class_step.TYPE == 'text':
#             ret
#         print(class_step.TYPE)
#         return Response({
#             'data': 'data',
#         })

class StepTextItem(APIView):
    # api/step-item/text/<int:step_id>
    def get(self, request, step_id):
        text = get_object_or_404(Text, pk=step_id)
        return Response({
            'text_html': text.text_html,
        })

    def post(self, request, step_id):
        text = get_object_or_404(Text, pk=step_id)
        print('text', text)
        user = request.user
        points = text.get_points(request.user)
        if not points:
            ProgressText.objects.create(user=user, step=text)

        return Response({
            'status': 'ok'
        })


class StepChoice(APIView):
    def get(self, request, step_id):
        choice = get_object_or_404(Choice, pk=step_id)
        if choice.preserve_order:
            answer_set = choice.answer_set.all()
        else:
            answer_set = choice.answer_set.order_by("?")

        answers = []
        for answer in answer_set[:choice.sample_size]:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        return Response({
            'id': choice.id,
            'text_html': choice.text_html,
            'is_multiple_choice': choice.is_multiple_choice,
            'is_always_correct': choice.is_always_correct,
            'preserve_order': choice.preserve_order,
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'sample_size': choice.sample_size,
            'points': choice.points,
            'answers': answers,
        })

    def post(self, request, step_id):
        data = request.data
        print('data', data)
        selected = data.get('selected', None)
        if not selected:
            return error
        choice = get_object_or_404(Choice, pk=step_id)
        user = request.user
        if choice.is_multiple_choice:
            answers = data.get('ansvers', [])
            if len(answers) != len(selected):
                return error
            progress_choice, points, solved = choice.check_answer_multi(user, selected, answers)
            if (not progress_choice) and solved:
                progress_choice = ProgressChoice.objects.create(user=user, step=choice, points=points)
            if progress_choice:
                progress_choice.answers.clear()
                progress_choice.answers_select.clear()
                for i, pk in enumerate(answers):
                    progress_choice.answers.add(pk)
                    if selected[i]:
                        progress_choice.answers_select.add(pk)
                # progress_choice.answers_select.clear()
                # for pk in selected:
                #     progress_choice.answers_select.add(pk)
                progress_choice.save()
            return Response({
                'status': 'ok',
                'points': points,  # int
                'solved': solved  # bool
            })
        else:
            is_choice_create, points, solved = choice.check_answer(user, selected)
            if (not is_choice_create) and solved:
                ProgressChoice.objects.create(user=user, step=choice, points=points)
            return Response({
                'status': 'ok',
                'points': points,  # int
                'solved': solved  # bool
            })


class Test(APIView):
    def get(self, request):
        # obj = Text.objects.all()
        # for item in obj:
        #     item.get_points(request.user)
        #
        # print(obj)
        return Response({
            'status': 'ok'
        })
