import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./VolunteerHome.css";
import EventCard from "../components/EventCard";

interface Post {
  _id: string;
  Title: string;
  OrgID: string;
}

const VolunteerHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Get All events (change later for filters or requirements)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/event/");
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        const data = (await response.json()) as Post[];
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the async function
  }, []); // Empty dependency array to run the effect

  return (
    <div>
      <div>
        <h1>Welcome to the Volunteer Hub</h1>
        <p>Look for events.</p>
      </div>
      <div>
        {posts.length === 0 && <p>No events found</p>}
        <ul className="list-group">
          {posts.map((post, index) => (
            <li
              className="list-group-item"
              key={post._id}
              onClick={() => console.log()}
            >
              <Link
                to="/volunteer/event"
                style={{ color: "#0b0b0b", textDecoration: "none" }}
              >
                {post.Title}
              </Link>
              - {post.OrgID}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VolunteerHome;
