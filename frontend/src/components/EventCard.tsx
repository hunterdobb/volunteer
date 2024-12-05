import React from "react";

export interface Event {
  _id: string;
  Title: string;
  Location: string;
  Date: string;
  Description: string;
  VolsNeeded: number;
  Volunteers: [string];
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
  let date = event.Date.substring(0, 10);
  let start = event.StartTime.substring(11, 16);
  let end = event.EndTime.substring(11, 16);
  let isodate = new Date(event.Date);
  let local = isodate.toLocaleDateString('en-US')


  return (
    <div className="event-card">
      <h3>{event.Title}</h3>
      <p><strong>Date:</strong> {local}</p>
      <p><strong>Location:</strong> {event.Location}</p>
      <p><strong>Volunteers Needed:</strong> {event.VolsNeeded}</p>
      <p><strong>Current Volunteers:</strong> {event.CurrentVols}</p>
      <p>{event.Description}</p>
      <p><strong>Time:</strong> {start} - {end}</p>

      {signedUp ? (
        <button className="withdrawButton" onClick={() => onWithdraw(event)}>
          Withdraw
        </button>
      ) : (
        <button className="registerButton" onClick={() => onSignUp(event)}>
          Sign Up
        </button>
      )}
    </div>
  );
};

export default EventCard;
