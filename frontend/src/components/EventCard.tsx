import React from "react";
import "./EventCard.css";

export interface Event {
  _id: string;
  Title: string;
  Location: string;
  Date: string;
  Description: string;
  VolsNeeded: number;
  Volunteers: string[]; // Array of volunteer IDs
  CurrentVols: number;
  StartTime: string;
  EndTime: string;
}

interface EventCardProps {
  event: Event;
  onDelete?: (event: Event) => void; // Optional delete function
  onSignUp?: (event: Event) => void; // Optional sign-up function
  onWithdraw?: (event: Event) => void; // Optional withdraw function
  signedUp?: boolean; // Optional signed-up flag
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onDelete,
  onSignUp,
  onWithdraw,
  signedUp = false,
}) => {
  const formattedDate = new Date(event.Date).toLocaleDateString("en-US");
  const formattedStartTime = new Date(event.StartTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = new Date(event.EndTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="event-card">
      <h3>{event.Title}</h3>
      <p>
        <strong>Date:</strong> {formattedDate}
      </p>
      <p>
        <strong>Location:</strong> {event.Location}
      </p>
      <p>
        <strong>Volunteers Needed:</strong> {event.VolsNeeded}
      </p>
      <p>
        <strong>Current Volunteers:</strong> {event.CurrentVols}
      </p>
      <p>
        <strong>Description:</strong> {event.Description}
      </p>
      <p>
        <strong>Time:</strong> {formattedStartTime} - {formattedEndTime}
      </p>

      {/* Render Delete button if onDelete is provided */}
      {onDelete && (
        <button className="deleteButton" onClick={() => onDelete(event)}>
          Delete
        </button>
      )}

      {/* Render Sign Up/Withdraw buttons for Volunteers */}
      {!signedUp && onSignUp && (
        <button className="registerButton" onClick={() => onSignUp(event)}>
          Sign Up
        </button>
      )}
      {signedUp && onWithdraw && (
        <button className="withdrawButton" onClick={() => onWithdraw(event)}>
          Withdraw
        </button>
      )}
    </div>
  );
};

export default EventCard;
