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

  // Extract organization ID from token
  const getOrgIDFromToken = (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch organization events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const orgID = getOrgIDFromToken();

      if (!orgID) {
        console.error('Organization ID not found.');
        return;
      }

      const response = await axios.get(`https://volunteer.hunterdobb.xyz/api/event/organization/${orgID}`, {
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

      const response = await axios.post('https://volunteer.hunterdobb.xyz/api/event', newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Event added successfully');
        fetchEvents();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      console.log('Failed to add event');
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
          <div className="event-container">
            {events.map((event) => (
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
            ))}
          </div>
        ) : (
          <p>No events available. Add your first event!</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationHome;
