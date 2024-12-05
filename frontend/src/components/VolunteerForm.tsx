import React, { useState } from "react";
import "./VolunteerForm.css";
import { Form, Button } from "react-bootstrap";

const VolunteerForm: React.FC<{
  onClose: () => void;
  onSubmit: (newEvent: any) => void;
}> = ({ onClose, onSubmit }) => {
  const [eventData, setEventData] = useState({
    Location: "",
    Date: "",
    Description: "",
    Title: "",
    VolsNeeded: "",
    CurrentVols: "",
    EndTime: "",
    StartTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Combine date and time into ISO DateTime strings
    const formattedStartTime = new Date(
      `${eventData.Date}T${eventData.StartTime}:00Z`
    ).toISOString();
    const formattedEndTime = new Date(
      `${eventData.Date}T${eventData.EndTime}:00Z`
    ).toISOString();

    const newEvent = {
      ...eventData,
      StartTime: formattedStartTime,
      EndTime: formattedEndTime,
    };

    onSubmit(newEvent); // Pass the event data to the parent component
  };

  return (
    <div>
      <form onSubmit={submitEvent}>
        <Form.Group className="mb-3">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            name="Title"
            value={eventData.Title}
            placeholder="Title"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="Location"
            value={eventData.Location}
            placeholder="Location"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="Description"
            value={eventData.Description}
            placeholder="Description"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="Date"
            value={eventData.Date}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Volunteers Needed</Form.Label>
          <Form.Control
            type="number"
            name="VolsNeeded"
            value={eventData.VolsNeeded}
            placeholder="Volunteers Needed"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Current Volunteers</Form.Label>
          <Form.Control
            type="number"
            name="CurrentVols"
            value={eventData.CurrentVols}
            placeholder="Current Volunteers"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="time"
            name="StartTime"
            value={eventData.StartTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="time"
            name="EndTime"
            value={eventData.EndTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Submit
        </Button>
        <Button variant="secondary" type="button" onClick={onClose}>
          Discard
        </Button>
      </form>
    </div>
  );
};

export default VolunteerForm;
