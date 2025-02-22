import React from "react";
import Navbar from "./Navbar";
import Card from "./card";
import axios from "axios";
import { useState, useEffect } from "react";
import checkAuth from "./checkAuth";

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);  // To handle loading state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const userId = user.id;
    console.log("User:", user);  // Check if user is being retrieved
    console.log("Token:", token);  // Check if token is available
    console.log("User ID:", userId); 

    if (!token || !userId) {
      console.log("User not authenticated. Please log in.");
      return;
    }
    axios
    .get(`http://127.0.0.1:8000/apiWatchList?user_id=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {   
            
      const watchlistData = Array.isArray(response.data) ? response.data : [response.data];
      console.log("Watchlist Data:", watchlistData);  // Log to verify the data structure
      const movieIds = watchlistData.map((item) => item.movie);
      console.log("Movie IDs:", movieIds);

      const moviePromises =  movieIds.map((movieId) =>
        axios.get(`http://127.0.0.1:8000/apiMovie?id=${movieId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
      );
      console.log("Fetching movie details for IDs:", movieIds);

      Promise.all(moviePromises)
        .then((movieResponses) => {
          
          const filteredMovieData = movieResponses.flatMap((response,index) => {
            
            const movieId = movieIds[index]; 
            const filteredMovies = response.data.filter(movie => movie.id === movieId);
            return filteredMovies;          
          });
          console.log("Filtered Movie Data:", filteredMovieData);
          const moviesWithWatchlistId = filteredMovieData.map((movie, index) => ({
            ...movie,
            watchlistId: watchlistData[index].id,  // Add watchlistId from watchlistData
          }));
          setWatchlist(moviesWithWatchlistId);
          setLoading(false);  // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
          setLoading(false);  // Set loading to false in case of error
        });
    })
    .catch((error) => {
      console.error("Error fetching watchlist:", error);
      setLoading(false);  // Set loading to false in case of error
    });
}, []);
const handleRemove = (watchlistId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  if (!token) {
    console.log("User is not authenticated. Cannot remove item from watchlist.");
    return;
  }

  console.log("Removing movie with ID:", watchlistId);  // Debugging
  console.log("User Token:", token);  // Debugging
  axios.delete(`http://127.0.0.1:8000/apiDeleteList?id=${watchlistId}`,{
    headers: {
      "Content-Type": "application/json",
      Authorization:`Token ${token}`,
    },
  })
  .then(() => {
    console.log("Deleting watchlist item with ID:", watchlistId);
     // Remove the deleted item from state
     setWatchlist(watchlist.filter(item => item.watchlistId !== watchlistId));
  })
  .catch((error) => {
    console.error("Error deleting movie from watchlist:", error);
  });
};
if (loading) {
  return <div>Loading...</div>;
}
  return (
    <div>
      <Navbar />
      <div className="card-container">
        {watchlist.length>0?(
          watchlist.map((movie, index) => {
            
          
 
            const title = movie.title || "No Title";
            const description = movie.description || "No Description";
            const thumbnail = movie.thumbnail ? decodeURIComponent(movie.thumbnail) : "No Thumbnail";
          
            console.log("Title:", title);
            console.log("Description:", description);
            console.log("Thumbnail URL:", thumbnail);
            console.log("watchlist id:",movie.id);
            console.log("Movie ID from watchlist:", movie.movie); 
          return(
            <Card
              key={index}
              movie={movie}
              actionButton={<button onClick={() => handleRemove(movie.watchlistId)}>Remove</button>}
              onClick={() => {
                // Add the functionality to navigate to movie details page
              }}
            />
          );
        })
        ):(
        <p>No movies in your watchlist.</p>
        )}
      </div>
    </div>
  );
}

export default checkAuth(WatchList);
