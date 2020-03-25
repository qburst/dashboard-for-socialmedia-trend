from rest_framework import generics

from api.utils.base_view import BaseViewManager
from api.utils.responses import send_response
from api.utils.constants import SUCCESS, FAIL
from api.models import TwitterData


class InfectedView(generics.ListAPIView):
    def get(self, request, **kwargs):
        try:
            infected = TwitterData.objects(category='INFECTED').limit(10)
            data = []
            for i in infected:
                data.append({"text": i.text,
                             # "country": i.country,
                             "category": i.category})
            return send_response({'status': SUCCESS, 'data': data})
        except Exception as err:
            print(err)
            return send_response({'status': FAIL})


class InfectedViewManger(BaseViewManager):
    VIEWS_BY_METHOD = {
        'GET': InfectedView.as_view
    }
