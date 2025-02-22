import React from "react";
import Navbar from "./Navbar";
import Card from "./card";
import axios from "axios";
import { useState, useEffect } from "react";
import checkAuth from "./checkAuth";

function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const userId = user.id;

    if (!token || !userId) {
      console.log("User not authenticated. Please log in.");
      return;
    }
    axios
      .get(`http://127.0.0.1:8000/apiwatchHistory?user_id=${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then(async(response) => {
        console.log("Watch History Data:", response.data);
        const updatedHistory = await Promise.all(
          response.data.map(async (item) => {
            if (typeof item.movie === "number") {
              try {
                const movieRes = await axios.get(`http://127.0.0.1:8000/apiMovieDetails?id=${item.movie}`, {
                  headers: { Authorization: `Token ${token}` },
                });
                return { ...item, movie: movieRes.data };
              } catch (err) {
                console.error("Error fetching movie details:", err);
                return { ...item, movie: { title: "Unknown", description: "No details", thumbnail: "" } };
              }
            }
            return item;
          })
        );
  
        setHistory(updatedHistory);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching watch history:", error);
        setLoading(false);
      });
  }, []);

  const handleRemove = (historyId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    
    if (!token) {
      console.log("User not authenticated. Cannot remove history item.");
      return;
    }
    if (!historyId) {
      console.log("Invalid history ID");
      return;
    }
    console.log("Attempting to delete history item with ID:", historyId); // Log to check if historyId is correct


    axios
      .delete(`http://127.0.0.1:8000/apiDeleteHist?id=${historyId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        console.log("Deleted history item with ID:", historyId);
        setHistory(history.filter((item) => item.id !== historyId));
      })
      .catch((error) => {
        console.error("Error deleting history item:", error);
      });
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Navbar />
      <div className="card-container">
      {history.length > 0 ? (
          history.map((item) => {
            console.log("Watch history item:", item); // Log each item to check its structure
            return (
              <Card
                key={item.id}
                movie={item.movie}
                actionButton={
                  <div className="action-button-wrapper">
                    <p>{item.date}</p>
                    <button
                      onClick={() => {
                      console.log("Deleting history item with ID:", item.id); // Debugging log
                      if (item.id) {
                        handleRemove(item.id);
                      } else {
                        console.error("Invalid history ID for deletion:", item);
                      }
                      }}
                    >
                      Delete
                  </button>
                  </div>
                }
                onClick={() => {
                  console.log(`Movie ID ${item.movie.id} clicked`);
                  // Add functionality to navigate to movie details page
                }}
              />
            );
          })
        ) : (
          <p>No movies in your watch history.</p>
        )}
      </div>
    
    </div>
  );
}

export default checkAuth(WatchHistory);
