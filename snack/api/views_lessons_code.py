from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Code
from progress.models import ProgressChoice, ProgressChoiceMulti, ProgressChoiceMultiItem

error = Response({
    'status': 'error'
})

LIMIT_RECORD = 5


class StepCode(APIView):
    def get(self, request, step_id):
        code = get_object_or_404(Code, pk=step_id)
        data = {
            # 'id': code.id,
            'text_html': code.text_html,
            # 'points': code.points,
        }

        data.update({
            "status": "ok",
            "points": 5,
            "has_progress": False,
            "student_points": 0,
            "code_examples": [["2", "*\n**\n"], ["3", "*\n**\n***\n"]],
            "user_code": "print(int(input()) + int(input()))"
            # "user_code": "# write code\n\n\n\n\n\n\n\n\n"
        })
        return Response(data)

    def post(self, request, step_id):
        data = request.data
        print('data', data)
        code = get_object_or_404(Code, pk=step_id)
        user_code = data.get('code', '')
        user_input = data.get('input', '')
        print('user_input', user_input)
        # print('code', code.check_code(user_code))
        if data.get('run_code', False):
            user_print = code.run_code(user_code, user_input)
            print('run_code', user_print)
            return Response({
                "status": "ok",
                "print": user_print
            })

        check_code = code.check_code(user_code)
        print('result check_code', check_code)
        return Response({
            "status": "ok",
            "text_html": "Побудувати пірамідку",
            "points": 5,
            "has_progress": False,
            "student_points": 0,
            "check_code": check_code,
            #"test_input": ["2", "*\n**\n", "3", "*\n**\n***\n"],
            "user_code": """class Car(object):
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def show_info(self):
        print(f'name: {self.name} year:{self.year}')
        
        
car = Car('BMW', 2024)
car.show_info()"""
        })
