from django.db import models


class Votes(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["session_id", "client_id"], name="unique_vote_per_user"
            )
        ]

    session_id = models.CharField(max_length=192)
    client_id = models.CharField(max_length=192)
    value = models.CharField(max_length=32)
