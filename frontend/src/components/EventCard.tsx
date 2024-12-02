import React from "react";
import { useEffect, useState} from "react";
import { useParams, useLocation} from "react-router-dom";

interface Event {
  _id: string;
}

const EventCard = (state: any) => {

  const params = useParams();
  const id = useLocation().state;
  console.log("params", params);
  console.log("id", id);

  const [events, setEvents] = useState<Event[]>([]);

  // Get All events (change later for filters or requirements)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/event/single/:{state}"
        );
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        const data = (await response.json()) as Event[];
        setEvents(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the async function
  }, []);

  const [registerButton, setRegisterButton] = useState(true);
  const [withdrawButton, setWithdrawButton] = useState(false);

  const toggleRegisterButton = () => {
    console.log("Register button clicked!");
    setRegisterButton(false); //change option
    setWithdrawButton(true);
  };

  const toggleWithdrawButton = () => {
    console.log("Withdraw button clicked!");
    setWithdrawButton(false); // change option
    setRegisterButton(true);
  };

  return (
    <div>
      <h2>Event Title - {id}</h2>
      <p>Event Organization</p>
      <p>Event Description</p>
      <p>Event Location</p>
      <p>Event Date, Start Time, and End Time</p>
      <p>Volunteers Needed, and Current Volunteers</p>

      {registerButton && (
        <button
          className="registerButton"
          type="submit"
          onClick={toggleRegisterButton}
        >
          Sign up
        </button>
      )}
      {withdrawButton && (
        <button
          className="registerButton"
          type="submit"
          onClick={toggleWithdrawButton}
        >
          Withdraw
        </button>
      )}
    </div>
  );
};

export default EventCard;
