import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHome.css";
import EventCard from "../components/EventCard";

interface Event {
  _id: string;
  Title: string;
  Location: string;
  Date: string;
  Description: string;
  VolsNeeded: number;
  CurrentVols: number;
  Volunteers: [string];
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

  const signUp = async (event: Event) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);
      const response = await axios.post(
        `http://localhost:5000/api/event/join/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Join", response);
    } catch (err) {
      console.error("Error joining event:", err);
      setError("Failed to join events. Please try again later.");
    }
  };

  const withdraw = async (event: Event) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);
      const response = await axios.post(
        `http://localhost:5000/api/event/leave/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Leave", response);
    } catch (err) {
      console.error("Error withdrawing from event:", err);
      setError("Failed to withdraw from events. Please try again later.");
    }
  };

  const handleSignUp = (event: Event) => {
    if (!signedUpEvents.some((e) => e._id === event._id)) {
      signUp(event);
      setSignedUpEvents((prevSignedUp) => [...prevSignedUp, event]);
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e._id !== event._id)
      );
      alert(`You signed up for: ${event.Title}`);
    } else {
      alert(`You are already signed up for: ${event.Title}`);
    }
  };

  const handleWithdraw = (event: Event) => {
    if (signedUpEvents.some((e) => e._id === event._id)) {
      withdraw(event);
      setSignedUpEvents((prevSignedUp) =>
        prevSignedUp.filter((e) => e._id !== event._id)
      );
      setEvents((prevEvents) => [...prevEvents, event]);
      alert(`You withdrew from: ${event.Title}`);
    } else {
      alert(`You are not signed up for: ${event.Title}`);
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
                  key={`available-${event._id}`} // Ensuring unique keys
                  event={event}
                  onSignUp={handleSignUp}
                  signedUp={false}
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
                  <EventCard
                    key={`signedup-${event._id}`} // Ensuring unique keys
                    event={event}
                    onSignUp={handleSignUp}
                    signedUp
                    onWithdraw={handleWithdraw}
                  />
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
