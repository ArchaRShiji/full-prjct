import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Card from "./card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import checkAuth from "./checkAuth";

function ViewMovie() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));  // Parse the object
    const token = user?.token;
    console.log(token)
    if (token) {
      axios
        .get("http://127.0.0.1:8000/apiMovie",
        {headers: {
          "Content-Type":"application/json",
          "Authorization": `Token ${token}`}}) 
        .then((response) => {
          console.log("Movies fetched:", response.data);
          setMovies(response.data); // Update state with fetched movies
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    }else{
      console.log("No token found. Please log in.");
      navigate("/login");
    }
  }, [navigate]);


  const handleWatchLater = (movieId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      console.log("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }
    const token = user.token;
    const userId = user.id;

    axios.post(
      "http://127.0.0.1:8000/apiwatchListAdd", 
      { user:userId, movie:movieId}, // Send userId and movieId as data
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    .then((response) => {
      console.log("Movie added to Watch Later:", response.data);
      alert("Movie added to Watch Later!");
    })
    .catch((error) => {
      console.error("Error adding movie to Watch Later:", error);
    });
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    if (!token) {
      console.log("No token found. Please log in.");
      navigate("/login");
      return;
    }
    axios
    .get(`http://127.0.0.1:8000/search?q=${e.target.value}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      setMovies(response.data); // Only update with searched results
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
    });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <Navbar/>
      <input
        type="text"
        placeholder="Search Movies..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="card-container">
        {filteredMovies.map((movie) => (
          <Card
            key={movie.id}
            movie={movie}
            onWatchLater={handleWatchLater}
            onClick={() => {
              console.log(`Movie ID ${movie.id} clicked`); 
              navigate(`/movie/${movie.id}`); 
            }}
          />
        ))}
      </div>
    </div>
  );
};


export default checkAuth(ViewMovie);
