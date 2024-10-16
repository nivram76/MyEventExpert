from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Dashboard: List events the user created and events they are attending, also create new events
class EventDashboardView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can access

    def get_queryset(self):
        user = self.request.user
        # Return events where the user is the creator or an attendee
        return Event.objects.filter(creator=user) | Event.objects.filter(attendees=user)

    def perform_create(self, serializer):
        # Automatically assign the event's creator as the logged-in user
        serializer.save(creator=self.request.user)

# Join an existing event
@api_view(['POST'])
def join_event(request, pk):
    event = get_object_or_404(Event, pk=pk)  # Retrieve the event by its primary key (pk)
    event.attendees.add(request.user)  # Add the requesting user to the attendees list
    return Response({"message": "You have joined the event."})

# Optionally, if you want a view to handle specific event details later
class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()  # Retrieve any event
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

# Delete an existing event
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_event(request, pk):
    event = get_object_or_404(Event, pk=pk)
    
    # Check if the user is either the creator or an admin
    if request.user == event.creator or request.user.is_staff:
        event.delete()
        return Response({"message": "Event deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"error": "You do not have permission to delete this event."}, status=status.HTTP_403_FORBIDDEN)

