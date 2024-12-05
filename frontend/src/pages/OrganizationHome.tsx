import React, { useEffect, useState } from "react";
import "./OrganizationHome.css";
import VolunteerForm from "../components/VolunteerForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventCard, { Event } from "../components/EventCard";

const OrganizationHome: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Extract organization ID from token
  const getOrgIDFromToken = (): string | null => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload._id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch organization events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const orgID = getOrgIDFromToken();

      if (!orgID) {
        console.error("Organization ID not found.");
        return;
      }

      const response = await axios.get(
        `https://volunteer.hunterdobb.xyz/api/event/organization/${orgID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event to the database
  const handleAddEventToDatabase = async (newEvent: any) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://volunteer.hunterdobb.xyz/api/event",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Event added successfully");
        fetchEvents();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Delete event from the database
  const handleDeleteEvent = async (event: Event) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://volunteer.hunterdobb.xyz/api/event/${event._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Event deleted successfully");
        setEvents((prevEvents) => prevEvents.filter((e) => e._id !== event._id));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="organization-home">
      <div className="organization-home-top">
        <h1>Welcome to the Organization Home Page</h1>
        <h6>Manage your organization's events and volunteer opportunities.</h6>
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="add-button d-flex">
        <button type="button" className="btn btn-success" onClick={() => setShowForm(true)}>
          Add New Event
        </button>
      </div>

      {showForm && (
        <VolunteerForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddEventToDatabase}
        />
      )}

      <div className="event-list">
        <h2>Your Events</h2>
        {events.length > 0 ? (
          <div className="event-container">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onDelete={handleDeleteEvent} />
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
