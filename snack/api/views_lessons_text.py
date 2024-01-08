from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from step.models import Text
from progress.models import ProgressText


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
