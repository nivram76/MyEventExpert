from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# List events the user created and events they are attending
class UserEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can access

    def get_queryset(self):
        user = self.request.user
        # Return events created by the user OR events the user is attending
        return Event.objects.filter(creator=user) | Event.objects.filter(attendees=user)

# Create a new event
class CreateEventView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the event's creator as the logged-in user
        serializer.save(creator=self.request.user)

# Join an existing event
@api_view(['POST'])
def join_event(request, pk):
    event = get_object_or_404(Event, pk=pk)  # Retrieve the event by its primary key (pk)
    event.attendees.add(request.user)  # Add the requesting user to the attendees list
    return Response({"message": "You have joined the event."})
