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
        return Response({
            "status": "ok",
            "text_html": "text_html",
        })

    def post(self, request, step_id):
        data = request.data
        print('data', data)
        code = get_object_or_404(Code, pk=step_id)
        user_code = data.get('code', '')
        user_input = data.get('input', '')
        print('user_input', user_input)
        # print('code', code.check_code(user_code))
        if data.get('run_code', False):
            res = code.run_code(user_code, user_input)
            print('run_code')
            return Response({
                "status": "ok",
                "print": res
            })
        return Response({
            "status": "ok",
            "text_html": "text_html",
        })
