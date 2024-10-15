# events/urls.py

from django.urls import path
from .views import UserEventsView, CreateEventView, join_event

urlpatterns = [
    # URL to list all events the user created or is attending
    path('events/', UserEventsView.as_view(), name='user-events'),

    # URL to create a new event
    path('events/create/', CreateEventView.as_view(), name='create-event'),

    # URL to join an event (requires the event's ID as part of the URL)
    path('events/join/<int:pk>/', join_event, name='join-event'),
]
