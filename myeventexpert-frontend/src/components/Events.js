import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'; // Import Bootstrap components
import './Events.css'; // Custom CSS for event styling

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/events/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleCreateEvent = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/events/',
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents([...events, response.data]);
      setShowCreateModal(false);
      setNewEvent({ title: '', description: '', date: '' });
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('access_token');
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8000/api/events/${eventId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error('Error deleting event', error);
      }
    }
  };

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  return (
    <Container className="events-container">
      <h1 className="text-center">My Events</h1>

      <Button variant="primary" onClick={handleShowCreateModal} className="mb-4">
        Create Event
      </Button>

      {/* Event Cards */}
      <Row>
        {events.map((event) => (
          <Col md={6} lg={3} key={event.id} className="mb-4">
            <Card className="event-card">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{event.date}</Card.Subtitle>
                <Card.Text>
                  {event.description.length > 50
                    ? `${event.description.substring(0, 50)}...`
                    : event.description}
                </Card.Text>
                <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>
                  Delete Event
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Event Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Events;