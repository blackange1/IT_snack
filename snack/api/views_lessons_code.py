from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Code
from progress.models import ProgressCode, ProgressCodeItem

error = Response({
    'status': 'error'
})

LIMIT_RECORD = 5


class StepCode(APIView):
    def get(self, request, step_id):
        code = get_object_or_404(Code, pk=step_id)
        # create code_examples
        test_case = code.testcase_set.all().order_by('order')[:code.count_show_test]
        code_examples = [[item.input, item.output] for item in test_case]
        data = {
            # 'id': code.id,
            'text_html': code.text_html,
            "points": code.points,
            "code_examples": code_examples,  # [["2", "*\n**\n"], ["3", "*\n**\n***\n"]],
        }
        progress = code.progresscode_set.filter(user=request.user).first()
        student_points = 0
        repeat_task, has_progress = True, False
        if progress:
            has_progress = True
            student_points = progress.points
            repeat_task = progress.repeat_task
            if not repeat_task:
                progress_code_item = progress.progresscodeitem_set.order_by('-id').first()
                if progress_code_item:
                    data.update({
                        'repeat_task': repeat_task,
                        'solved': progress.solved,
                        'student_solved': progress_code_item.solved,
                        "has_progress": True,
                        "student_points": student_points,
                        "user_code": progress_code_item.user_code
                    })
                    return Response(data)

        print('code_examples', code_examples)
        data.update({
            'repeat_task': repeat_task,
            # 'solved': progress.solved,
            # 'student_solved': progress_code_item.solved,
            "status": "ok",
            "has_progress": has_progress,
            "student_points": student_points,
            "user_code": "# write code\n\n\n\n\n\n\n\n\n"
        })
        return Response(data)

    def post(self, request, step_id):
        data = request.data
        code = get_object_or_404(Code, pk=step_id)
        user_code = data.get('code', '')
        # RUN CODE
        if data.get('run_code', False):
            user_input = data.get('input', '')
            print('user_input', user_input)
            user_print = code.run_code(user_code, user_input)
            print('run_code', user_print)
            return Response({
                "status": "ok",
                "print": user_print,
            })

        user = request.user
        progress, points, solved, tests = code.check_code(user_code, user)
        if not progress:
            progress = ProgressCode.objects.create(
                user=user,
                step=code,
                points=points,
                solved=solved,
            )
        if (not progress.solved) and solved:
            if points > 0:
                progress.points = points
            progress.solved = True
        progress.repeat_task = False
        progress.save()

        ProgressCodeItem.objects.create(
            progress_code=progress,
            points=points,
            solved=solved,
            user_code=user_code,
        )

        progress_code_item_set = progress.progresscodeitem_set.all().order_by('-id')
        for progress_code_item in progress_code_item_set[LIMIT_RECORD:]:
            progress_code_item.delete()

        print('progress, points, solved, tests', progress, points, solved, tests)
        check_code = ''
        test_info = tests
        return Response({
            "status": "ok",
            # 'points': points,  # int
            'solved': solved,  # bool
            'test_info': test_info,  # list
            "student_points": points,
            # "check_code": check_code,
        })

    def patch(self, request, step_id):
        code = get_object_or_404(Code, pk=step_id)
        progress = code.progresscode_set.filter(user=request.user).first()
        if not progress:
            return error

        progress.repeat_task = True
        progress.save()

        return Response({
            'points': code.points,
            'repeat_task': True,
        })
