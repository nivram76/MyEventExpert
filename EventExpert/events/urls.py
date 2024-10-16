from django.urls import path
from .views import EventDashboardView, join_event, delete_event

urlpatterns = [
    # URL to list all events the user created or is attending, and to create a new event
    path('dashboard/', EventDashboardView.as_view(), name='event-dashboard'),

    # URL to join an event
    path('join/<int:pk>/', join_event, name='join-event'),

    # URL to delete an event (only the creator can delete)
    path('delete/<int:pk>/', delete_event, name='delete-event'),
]
