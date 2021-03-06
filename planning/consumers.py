import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Votes


class PlanningConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.topic_name = self.scope["url_route"]["kwargs"]["topic_name"]
        self.topic_group_name = "planning_%s" % self.topic_name

        await self.channel_layer.group_add(self.topic_group_name, self.channel_name)

        await self.accept()

        votes = await self.get_votes()
        for vote in votes:
            await self.send(
                text_data=json.dumps(
                    {"message": vote.value, "client_id": vote.client_id}
                )
            )

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

        if message == "RESET":
            await self.clear_votes()
        else:
            await self.save_vote(client_id, message)

        await self.send(
            text_data=json.dumps({"message": message, "client_id": client_id})
        )

    @database_sync_to_async
    def clear_votes(self):
        return Votes.objects.filter(session_id=self.topic_name).delete()

    @database_sync_to_async
    def save_vote(self, client_id, message):
        vote, created = Votes.objects.get_or_create(
            session_id=self.topic_name,
            defaults=dict(client_id=client_id, value=message),
        )
        if not created:
            vote.value = message
            vote.save()
        return vote

    @database_sync_to_async
    def get_votes(self):
        return list(Votes.objects.filter(session_id=self.topic_name))
