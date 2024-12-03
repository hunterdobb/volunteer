import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHome.css";
import EventCard from "../components/EventCard"; // Import EventCard component

interface Event {
  _id: string;
  Title: string;
  Location: string;
  Date: string;
  Description: string;
  VolsNeeded: number;
  CurrentVols: number;
  StartTime: string;
  EndTime: string;
}

const VolunteerHome: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/event");
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle Sign Up for an event
  const handleSignUp = async (event: Event) => {
    if (!event._id) {
      alert("Event ID is missing!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to sign up for an event!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/event/${event._id}/signup`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSignedUpEvents((prev) => [...prev, event]);
        alert(`You have successfully signed up for: ${event.Title}`);
      } else {
        alert("Failed to sign up for the event.");
      }
    } catch (error) {
      console.error("Error signing up for event:", error);
    }
  };

  // Handle Withdraw from an event
  const handleWithdraw = async (event: Event) => {
    if (!event._id) {
      alert("Event ID is missing!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to withdraw from an event!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/event/${event._id}/withdraw`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSignedUpEvents((prev) => prev.filter((e) => e._id !== event._id));
        alert(`You have successfully withdrawn from: ${event.Title}`);
      } else {
        alert("Failed to withdraw from the event.");
      }
    } catch (error) {
      console.error("Error withdrawing from event:", error);
    }
  };

  return (
    <div className="volunteer-home">
      <h1>Welcome to the Volunteer Hub</h1>
      <p>Explore available events and sign up to make a difference!</p>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="event-container">
          <div className="available-events">
            <h2>Available Events</h2>
            <div className="event-list">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onSignUp={handleSignUp}
                  signedUp={signedUpEvents.some((e) => e._id === event._id)}
                  onWithdraw={handleWithdraw}
                />
              ))}
            </div>
          </div>

          <div className="signed-up-events">
            <h2>Signed Up Events</h2>
            <div className="event-list">
              {signedUpEvents.length > 0 ? (
                signedUpEvents.map((event) => (
                  <div key={event._id} className="event-card">
                    <h3>{event.Title}</h3>
                    <p><strong>Date:</strong> {event.Date}</p>
                    <p><strong>Location:</strong> {event.Location}</p>
                    <p><strong>Volunteers Needed:</strong> {event.VolsNeeded}</p>
                    <p><strong>Current Volunteers:</strong> {event.CurrentVols}</p>
                    <p>{event.Description}</p>
                    <p><strong>Time:</strong> {event.StartTime} - {event.EndTime}</p>

                    <button
                      className="withdrawButton"
                      onClick={() => handleWithdraw(event)}
                    >
                      Withdraw
                    </button>
                  </div>
                ))
              ) : (
                <p>You haven't signed up for any events yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerHome;
