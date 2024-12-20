import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHome.css";
import EventCard, { Event } from "../components/EventCard"; // Import the Event type
import { useNavigate } from "react-router-dom";

const VolunteerHome: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Volunteer Hub';
  }, []);

  const setUpEvents = async () => {
    const email = localStorage.getItem("email");
    const volunteer = await axios.get(
      `https://volunteer.hunterdobb.xyz/api/volunteer/email/${email}`
    );
    const vol_id = volunteer.data._id;
    // Need to get volunteer id to auto set signed up events to signedup
    events.forEach((event) => {
      if (event.Volunteers.includes(vol_id)) {
        setSignedUpEvents((prev) => {
          // Avoid duplicating events in the list
          if (!prev.some((e) => e._id === event._id)) {
            return [...prev, event];
          }
          return prev;
        });
      }
    });
  };

  setUpEvents();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://volunteer.hunterdobb.xyz/api/event");
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
      const response = await axios.post(
        `https://volunteer.hunterdobb.xyz/api/event/join/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Use the response variable
      if (response.status === 200) {
        console.log("Successfully joined the event");
      }
    } catch (err) {
      console.error("Error joining event:", err);
      setError("Failed to join events. Please try again later.");
    }
  };

  /*
  const withdraw = async (event: Event) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://volunteer.hunterdobb.xyz/api/event/leave/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Use the response variable
      if (response.status === 200) {
        console.log("Successfully left the event");
      }
    } catch (err) {
      console.error("Error leaving event:", err);
      setError("Failed to leave events. Please try again later.");
    }
  };*/

  const updateEvent = async (event: Event) => {
    try {
      const response = await axios.get(
        `https://volunteer.hunterdobb.xyz/api/event/single/${event._id}`
      );
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === event._id ? response.data : e))
      );
      setSignedUpEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === event._id ? response.data : e))
      );
      console.log("event", event);
      console.log("events", events);
      console.log("Sevents", signedUpEvents);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  // Handle sign-up locally
  const handleSignUp = (event: Event) => {
    if (!signedUpEvents.some((e) => e._id === event._id)) {
      signUp(event);
      updateEvent(event);
      setSignedUpEvents((prev) => [...prev, event]);
      console.log(`You signed up for: ${event.Title}`);
    } else {
      console.log(`You are already signed up for: ${event.Title}`);
    }
  };

  // Handle withdrawal locally
  const handleWithdraw = async (event: Event) => {
    try {
      // Call the backend to withdraw from the event
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://volunteer.hunterdobb.xyz/api/event/leave/${event._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Successfully left the event");
  
        // Update the UI immediately by removing the event from signedUpEvents
        setSignedUpEvents((prev) => prev.filter((e) => e._id !== event._id));
  
        // Optionally, update the main events list
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e._id === event._id
              ? { ...e, CurrentVols: e.CurrentVols - 1 } // Decrement volunteer count
              : e
          )
        );
      }
    } catch (err) {
      console.error("Error leaving event:", err);
      setError("Failed to leave event. Please try again later.");
    }
  };
  

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");  // Remove token
    localStorage.removeItem("email");  
    navigate("/");  
  };

  return (
    <div className="volunteer-home">
      <h1>Welcome to the Volunteer Hub</h1>
      <h3>Explore available events and sign up to make a difference!</h3>

      {/* Logout Button */}
      <div className="logout-Button" onClick={handleLogout}>
        Logout
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="event-container">
          <div className="available-events">
            <h2>Available Events</h2>
            <div className="event-list">
              {events.map(
                (event) =>
                  !signedUpEvents.some((e) => e._id === event._id) && (
                    <EventCard
                      key={event._id}
                      event={event}
                      onSignUp={handleSignUp}
                      signedUp={signedUpEvents.some((e) => e._id === event._id)}
                      onWithdraw={handleWithdraw}
                    />
                  )
              )}
            </div>
          </div>

          <div className="signed-up-events">
            <h2>Signed Up Events</h2>
            <div className="event-list">
              {signedUpEvents.length > 0 ? (
                signedUpEvents.map(
                  (event) =>
                    signedUpEvents.some((e) => e._id === event._id) && (
                      <EventCard
                        key={event._id}
                        event={event}
                        onSignUp={handleSignUp}
                        signedUp
                        onWithdraw={handleWithdraw}
                      />
                    )
                )
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
