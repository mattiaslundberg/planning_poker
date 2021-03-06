import json
from channels.generic.websocket import AsyncWebsocketConsumer


class PlanningConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.topic_name = self.scope["url_route"]["kwargs"]["topic_name"]
        self.topic_group_name = "planning_%s" % self.topic_name

        await self.channel_layer.group_add(self.topic_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, _):
        await self.channel_layer.group_discard(self.room_topic_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        await self.channel_layer.group_send(
            self.topic_group_name, {"type": "vote_message", "message": message}
        )

    async def vote_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))
