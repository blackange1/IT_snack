from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Choice
from progress.models import ProgressChoice, ProgressChoiceItem

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
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'points': choice.points,
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
                        # 'points': choice.points,
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
            # 'points': choice.points,
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

        answer_ids = data.get('answer_ids', [])
        progress, points, solved, list_answers = choice.check_answer(user, selected, answer_ids)
        if not progress:
            progress = ProgressChoice.objects.create(
                user=user,
                step=choice,
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
        ProgressChoiceItem.objects.create(
            progress_choice=progress,
            points=points,
            solved=solved,
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

        data = {
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
            'points': choice.points,
            'answers': answers,
            'repeat_task': True,
        })
        return Response(data)
