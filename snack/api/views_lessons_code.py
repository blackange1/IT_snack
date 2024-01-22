from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import ChoiceMulti
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
