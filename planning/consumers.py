import json
from channels.generic.websocket import AsyncWebsocketConsumer


class PlanningConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.topic_name = self.scope["url_route"]["kwargs"]["topic_name"]
        self.topic_group_name = "planning_%s" % self.topic_name

        await self.channel_layer.group_add(self.topic_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, _):
        await self.channel_layer.group_discard(self.topic_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        client_id = text_data_json["client_id"]

        await self.channel_layer.group_send(
            self.topic_group_name,
            {"type": "vote_message", "message": message, "client_id": client_id},
        )

    async def vote_message(self, event):
        message = event["message"]
        client_id = event["client_id"]

        await self.send(
            text_data=json.dumps({"message": message, "client_id": client_id})
        )
