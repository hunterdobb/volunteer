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

  // Handle sign-up locally
  const handleSignUp = (event: Event) => {
    if (!signedUpEvents.some((e) => e._id === event._id)) {
      setSignedUpEvents((prev) => [...prev, event]);
      alert(`You signed up for: ${event.Title}`);
    } else {
      alert(`You are already signed up for: ${event.Title}`);
    }
  };

  // Handle withdrawal locally
  const handleWithdraw = (event: Event) => {
    if (signedUpEvents.some((e) => e._id === event._id)) {
      setSignedUpEvents((prev) => prev.filter((e) => e._id !== event._id));
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
        <div className="event-sections">
          {/* Signed-Up Events Section */}
          <div className="signed-up-section">
            <h2>Signed-Up Events</h2>
            <div className="signed-up-events">
              {signedUpEvents.length > 0 ? (
                signedUpEvents.map((event) => (
                  <EventCard
                    key={event._id}
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

          {/* Available Events Section */}
          <div className="available-section">
            <h2>Available Events</h2>
            <div className="available-events">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onSignUp={handleSignUp}
                    signedUp={signedUpEvents.some((e) => e._id === event._id)}
                    onWithdraw={handleWithdraw}
                  />
                ))
              ) : (
                <p>No available events at the moment. Check back later!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerHome;
