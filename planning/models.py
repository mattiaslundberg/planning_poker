from django.db import models


class Votes(models.Model):
    session_id = models.CharField(max_length=192)
    client_id = models.CharField(max_length=192)
    value = models.CharField(max_length=32)
