from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Text, Choice, AnswerChoice
from progress.models import ProgressText, ProgressChoice, ProgressChoiceItem

error = Response({
    'status': 'error'
})

LIMIT_RECORD = 5


class StepChoice(APIView):
    def get(self, request, step_id):
        choice = get_object_or_404(Choice, pk=step_id)
        data = {
            'id': choice.id,
            'text_html': choice.text_html,
            # 'is_always_correct': choice.is_always_correct,  # del
            # 'preserve_order': choice.preserve_order,  # del
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'points': choice.points,
            # 'is_multiple_choice': choice.is_multiple_choice,
        }
        progress = choice.progresschoice_set.filter(user=request.user).first()
        student_points, answers = 0, []
        repeat_task, has_progress = True, False
        if progress:
            has_progress = True
            student_points = progress.points
            repeat_task = progress.repeat_task
            if not repeat_task:
                progress_choice_item = progress.progresschoiceitem_set.order_by('-id').first()
                if progress_choice_item:
                    data.update({
                        'points': choice.points,
                        'student_solved': progress_choice_item.solved,
                        # 'index': progress_choice_item.index,
                        'repeat_task': repeat_task,
                        'answers_json': progress_choice_item.answers_json,
                        'solved': progress.solved,
                        'has_progress': True,
                        'student_points': student_points,
                    })
                    return Response(data)

        if choice.preserve_order:
            answer_choice_set = choice.answerchoice_set.order_by("order")
        else:
            answer_choice_set = choice.answerchoice_set.order_by("?")

        # for answer in answerchoice_set[:choice.sample_size]:
        for answer in answer_choice_set:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        data.update({
            'points': choice.points,
            'answers': answers,
            'repeat_task': repeat_task,
            'has_progress': has_progress,
            'student_points': student_points,
        })
        return Response(data)

    def post(self, request, step_id):
        data = request.data
        selected = data.get('selected', None)
        if not selected:
            return error
        choice = get_object_or_404(Choice, pk=step_id)
        user = request.user
        if False:
        # if choice.is_multiple_choice:
            answer_ids = data.get('answer_ids', [])
            print('selected', selected)
            print('user, selected, answer_ids', user, selected, answer_ids)

            return Response({
                'status': 'ok',
                'points': 1,  # int
                'solved': False  # bool
            })
            # FIXED
            answer_ids = data.get('answer_ids', [])
            # progress, points, solved, list_answers = choice.check_answer_multi(user, selected, answer_ids)
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
            answer_ids = data.get('answer_ids', [])
            progress, points, solved, list_answers = choice.check_answer(user, selected, answer_ids)
            if not progress:
                progress = ProgressChoice.objects.create(
                    user=user,
                    step=choice,
                    points=points,
                    solved=solved,
                )
            # select_answer = AnswerChoice.objects.get(pk=selected)
            if (not progress.solved) and solved:
                if points > 0:
                    progress.points = points
                progress.solved = True
            progress.repeat_task = False
            progress.save()

            selected_indexes = data.get('selected_indexes', [])
            ProgressChoiceItem.objects.create(
                progress_choice=progress,
                points=points,
                solved=solved,
                # index=index,
                answers_json=[list_answers, selected_indexes]
            )

            # delete progress_choice_item
            progress_choice_item_set = progress.progresschoiceitem_set.all().order_by('-id')
            for progress_choice_item in progress_choice_item_set[LIMIT_RECORD:]:
                progress_choice_item.delete()

            return Response({
                'status': 'ok',
                'student_points': points,  # int
                'solved': solved  # bool
            })

    def patch(self, request, step_id):
        choice = get_object_or_404(Choice, pk=step_id)
        progress = choice.progresschoice_set.filter(user=request.user).first()
        if not progress:
            return error

        progress.repeat_task = True
        progress.save()

        choice = get_object_or_404(Choice, pk=step_id)
        data = {
            # 'id': choice.id,
            # 'text_html': choice.text_html,
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'points': choice.points,
        }

        answers = []
        if choice.preserve_order:
            answer_choice_set = choice.answerchoice_set.order_by("order")
        else:
            answer_choice_set = choice.answerchoice_set.order_by("?")

        for answer in answer_choice_set:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        data.update({
            # 'is_multiple_choice': choice.is_multiple_choice,
            'points': choice.points,
            'answers': answers,
            'repeat_task': True,
        })
        return Response(data)


class Test(APIView):
    def get(self, request):
        repeat_task = True
        # obj = Text.objects.all()
        # for item in obj:
        #     item.get_points(request.user)
        #
        # print(obj)
        return Response({
            'status': 'ok'
        })
