from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import ChoiceMulti
from progress.models import ProgressChoice, ProgressChoiceMulti, ProgressChoiceMultiItem

error = Response({
    'status': 'error'
})

LIMIT_RECORD = 5


class StepChoiceMulti(APIView):
    def get(self, request, step_id):
        choice = get_object_or_404(ChoiceMulti, pk=step_id)
        data = {
            'id': choice.id,
            'text_html': choice.text_html,
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'points': choice.points,
        }
        progress = choice.progresschoicemulti_set.filter(user=request.user).first()
        student_points, answers = 0, []
        repeat_task, has_progress = True, False
        if progress:
            has_progress = True
            student_points = progress.points
            repeat_task = progress.repeat_task
            if not repeat_task:
                progress_choice_multi_item = progress.progresschoicemultiitem_set.order_by('-id').first()
                if progress_choice_multi_item:
                    data.update({
                        # 'points': choice.points,
                        'repeat_task': repeat_task,
                        'solved': progress.solved,
                        'student_solved': progress_choice_multi_item.solved,
                        # 'index': progress_choice_item.index,
                        'answers_json': progress_choice_multi_item.answers_json,
                        'has_progress': True,
                        'student_points': student_points,
                    })
                    return Response(data)

        if choice.preserve_order:
            answer_choice_set = choice.answerchoicemulti_set.order_by("order")
        else:
            answer_choice_set = choice.answerchoicemulti_set.order_by("?")

        # # for answer in answerchoice_set[:choice.sample_size]:
        for answer in answer_choice_set:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        data.update({
            # 'points': choice.points,
            # 'answers': answers,
            # 'repeat_task': repeat_task,
            # 'has_progress': has_progress,
            # 'student_points': student_points,

            # 'points': choice.points,
            'answers': answers,
            'repeat_task': repeat_task,
            'has_progress': has_progress,
            'student_points': student_points,
        })
        return Response(data)

    def post(self, request, step_id):
        data = request.data

        choice_multi = get_object_or_404(ChoiceMulti, pk=step_id)
        user = request.user

        answer_ids = data.get('answer_ids', [])
        if not answer_ids:
            return error
        selected_indexes = data.get('selected_indexes', [])
        progress, points, solved, list_answers = choice_multi.check_answer_multi(user, selected_indexes, answer_ids)
        print('progress, points, solved, list_answers', progress, points, solved, list_answers)

        if not progress:
            progress = ProgressChoiceMulti.objects.create(
                user=user,
                step=choice_multi,
                points=points,
                solved=solved,
            )
        if (not progress.solved) and solved:
            if points > 0:
                progress.points = points
            progress.solved = True
        progress.repeat_task = False
        progress.save()

        selected_indexes = data.get('selected_indexes', None)
        ProgressChoiceMultiItem.objects.create(
            progress_choice=progress,
            points=points,
            solved=solved,
            answers_json=[list_answers, selected_indexes]
        )

        # delete progress_choice_item
        progress_choice_multi_item_set = progress.progresschoicemultiitem_set.all().order_by('-id')
        for progress_choice_multi_item in progress_choice_multi_item_set[LIMIT_RECORD:]:
            progress_choice_multi_item.delete()

        return Response({
            'status': 'ok',
            'points': points,  # int
            'solved': solved  # bool
        })

    def patch(self, request, step_id):
        choice_multi = get_object_or_404(ChoiceMulti, pk=step_id)
        progress = choice_multi.progresschoicemulti_set.filter(user=request.user).first()
        if not progress:
            return error

        progress.repeat_task = True
        progress.save()

        data = {
            'is_html_enabled': choice_multi.is_html_enabled,
            'is_options_feedback': choice_multi.is_options_feedback,
            'points': choice_multi.points,
        }

        answers = []
        if choice_multi.preserve_order:
            answer_choice_set = choice_multi.answerchoicemulti_set.order_by("order")
        else:
            answer_choice_set = choice_multi.answerchoicemulti_set.order_by("?")

        for answer in answer_choice_set:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        data.update({
            # 'is_multiple_choice': choice.is_multiple_choice,
            'points': choice_multi.points,
            'answers': answers,
            'repeat_task': True,
        })
        return Response(data)
