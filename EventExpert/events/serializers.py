# events/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EventSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)  # Display the creator's info but don't allow changes
    attendees = UserSerializer(many=True, read_only=True)  # Display attendees' info

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'creator', 'attendees']
