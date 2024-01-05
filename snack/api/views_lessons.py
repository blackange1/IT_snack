from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Text, Choice, AnswerChoice
from progress.models import ProgressText, ProgressChoice, ProgressChoiceItem

error = Response({
    'status': 'error'
})

LIMIT_RECORD = 10


class StepTextItem(APIView):
    # api/step-item/text/<int:step_id>
    def get(self, request, step_id):
        text = get_object_or_404(Text, pk=step_id)
        return Response({
            'text_html': text.text_html,
        })

    def post(self, request, step_id):
        text = get_object_or_404(Text, pk=step_id)
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
        data = {
            'id': choice.id,
            'text_html': choice.text_html,
            'is_always_correct': choice.is_always_correct,  # del
            'preserve_order': choice.preserve_order,  # del
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'points': choice.points,
        }
        progress = choice.progresschoice_set.filter(user=request.user).first()
        repeat_task = True
        answers = []
        if progress:
            repeat_task = progress.repeat_task
            if not repeat_task:
                progress_choice_item = progress.progresschoiceitem_set.order_by('-id').first()
                if progress_choice_item:
                    answer_choice_set = choice.answerchoice_set.all()
                    for answer in answer_choice_set:
                        answers.append({
                            'id': answer.id,
                            'text': answer.text
                        })
                    data.update({
                        'points': choice.points,
                        'answers': answers,
                        'order_answers': progress_choice_item.order_answers,
                        'solved_item': progress_choice_item.solved,
                        'select_answer': progress_choice_item.select_answer.id,
                        'repeat_task': repeat_task,
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
            answers = data.get('answers', [])
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
            order_answers = data.get('order_answers', [])
            progress, points, solved = choice.check_answer(user, selected)
            if not progress:
                progress = ProgressChoice.objects.create(
                    user=user,
                    step=choice,
                    points=points,
                    solved=solved,
                )
            select_answer = AnswerChoice.objects.get(pk=selected)
            if (not progress.solved) and solved:
                if points > 0:
                    progress.points = points
                progress.solved = True
            progress.repeat_task = False
            progress.save()

            ProgressChoiceItem.objects.create(
                progress_choice=progress,
                order_answers=order_answers,
                points=points,
                solved=solved,
                select_answer=select_answer
            )

            progress_choice_item_set = progress.progresschoiceitem_set.all().order_by('-id')
            for progress_choice_item in progress_choice_item_set[LIMIT_RECORD:]:
                progress_choice_item.delete()

            return Response({
                'status': 'ok',
                'points': points,  # int
                'solved': solved  # bool
            })

    def patch(self, request, step_id):
        choice = get_object_or_404(Choice, pk=step_id)
        progress = choice.progresschoice_set.filter(user=request.user).first()
        if not progress:
            return error
        data = request.data
        repeat_task = data.get('repeat_task', None)
        if repeat_task is not None:
            progress.repeat_task = repeat_task
            progress.save()
        return Response({
            'status': 'ok',
        })


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
