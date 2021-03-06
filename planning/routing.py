from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/planning/(?P<topic_name>\w+)/$", consumers.PlanningConsumer.as_asgi()),
]
