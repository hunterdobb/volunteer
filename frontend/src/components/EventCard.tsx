import React, { useState } from "react";

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

interface EventCardProps {
  event: Event;
  onSignUp: (event: Event) => void;
  onWithdraw: (event: Event) => void;
  signedUp: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSignUp, onWithdraw, signedUp }) => {
  return (
    <div className="event-card">
      <h3>{event.Title}</h3>
      <p><strong>Date:</strong> {event.Date}</p>
      <p><strong>Location:</strong> {event.Location}</p>
      <p><strong>Volunteers Needed:</strong> {event.VolsNeeded}</p>
      <p><strong>Current Volunteers:</strong> {event.CurrentVols}</p>
      <p>{event.Description}</p>
      <p><strong>Time:</strong> {event.StartTime} - {event.EndTime}</p>

      {!signedUp ? (
        <button className="registerButton" onClick={() => onSignUp(event)}>
          Sign Up
        </button>
      ) : (
        <button className="withdrawButton" onClick={() => onWithdraw(event)}>
          Withdraw
        </button>
      )}
    </div>
  );
};

export default EventCard;
