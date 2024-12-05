import React, { useEffect, useState } from 'react';
import './OrganizationHome.css';
import VolunteerForm from '../components/VolunteerForm';
import axios from 'axios';

interface Event {
  _id: string;
  Title: string;
  Description: string;
  Location: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  VolsNeeded: number;
  CurrentVols: number;
}

const OrganizationHome: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch organization events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const orgID = 'organization-id-from-token'; // Replace this with logic to extract from the token

      const response = await axios.get(`http://localhost:5000/api/event/organization/${orgID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event to the database
  const handleAddEventToDatabase = async (newEvent: any) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/event', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        alert('Event added successfully');
        fetchEvents(); // Refresh the list of events
        setShowForm(false); // Close the form after submission
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to add event');
    }
  };

  return (
    <div className="organization-home">
      <div className="organization-home-top">
        <h1>Welcome to the Organization Home Page</h1>
        <h6>Manage your organization's events and volunteer opportunities.</h6>
      </div>

      <div className="add-button d-flex">
        <button type="button" className="btn btn-success" onClick={() => setShowForm(true)}>
          Add New Event
        </button>
      </div>

      {showForm && (
        <VolunteerForm onClose={() => setShowForm(false)} onSubmit={handleAddEventToDatabase} />
      )}

      <div className="event-list">
        <h2>Your Events</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.Title}</h3>
              <p>{event.Description}</p>
              <p>
                <strong>Location:</strong> {event.Location}
              </p>
              <p>
                <strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {event.StartTime} - {event.EndTime}
              </p>
              <p>
                <strong>Volunteers Needed:</strong> {event.CurrentVols}/{event.VolsNeeded}
              </p>
            </div>
          ))
        ) : (
          <p>No events available. Add your first event!</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationHome;
