import React, { useState } from "react";
import "./OrganizationHome.css";
import VolunteerForm from "../components/VolunteerForm";

const OrganizationHome: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddEventToDatabase = async (newEvent: any) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the stored token

      if (!token) {
        console.error("No authorization token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        console.log("Event added successfully");
        setShowForm(false); // Close the form after submission
      } else {
        console.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <div className="organization-home-top">
        <h1>Welcome to the Organization Home Page</h1>
        <h6>Manage your organization's events and volunteer opportunities.</h6>
      </div>

      <div className="add-button d-flex">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          Add New Event
        </button>
      </div>

      {showForm && (
        <VolunteerForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddEventToDatabase}
        />
      )}
    </div>
  );
};

export default OrganizationHome;
