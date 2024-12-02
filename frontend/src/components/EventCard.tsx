import React from "react";

const EventCard = () => {
  return (
    <div>
      <h2>Event Title</h2>
      <p>Event Organization</p>
      <p>Event Description</p>
      <p>Event Location</p>
      <p>Event Date, Start Time, and End Time</p>
      <p>Volunteers Needed, and Current Volunteers</p>

      <button className="registerButton" type="submit">
        Sign up
      </button>
    </div>
  );
};

export default EventCard;
