import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  useEffect(() => {
    // Fetch movie details when the page loads
    if (token) {
      axios
        .get(`http://127.0.0.1:8000/apiMovieDetails?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          console.log("API Response:", response.data);
          //const fetchedMovie = response.data.find((movie) => movie.id === parseInt(id)); 
          //console.log("Movie data:", fetchedMovie);
          setMovie(response.data);
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
        });
    }
  }, [id, token]);

  useEffect(() => {
    // After movie is fetched, add to watch history
    if (movie && user && token) {
      const payload = {
        user: user.id,
        movie:movie.id,
        date: new Date().toLocaleTimeString("en-GB", { hour12: false }) // Correct date format (hh:mm:ss)
      };
      console.log("Watch History Payload:", payload);

      axios
        .post(
          "http://127.0.0.1:8000/watchHistory_add", // Watch history add endpoint
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Added to watch history:", response.data);
        })
        .catch((error) => {
          console.error("Error adding to watch history:", error.response?.data || error);
        });
    }
  }, [movie, user, token, id]); // This effect will run once movie data is available

  if (!movie) {
    return (
      <div>
        <Navbar />
        <h2>Movie not found</h2>
      </div>
    );
  }
  const cleanThumbnailUrl = decodeURIComponent(movie.thumbnail.replace(/^\//, ""));
  const cleanVideoUrl = decodeURIComponent(movie.video.replace(/^\//, ""));

  return (
    <div>
      <Navbar />
      <div className="movie-details">
      
      {movie.thumbnail && <img src={cleanThumbnailUrl} alt={movie.title} />}
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      {/* Embed video correctly */}
      {cleanVideoUrl.includes("youtube.com") || cleanVideoUrl.includes("youtu.be") ? (
      <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${extractYouTubeID(cleanVideoUrl)}`}
      title="YouTube Video Player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  ) : (
    <video width="560" height="315" controls>
      <source src={cleanVideoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )}
    </div>
    </div>
  );
}

function extractYouTubeID(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : "";
}

export default MovieDetailsPage;
