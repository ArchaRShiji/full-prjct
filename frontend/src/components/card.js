import React from "react";

function Card({ movie, onWatchLater, onRemove, onClick, actionButton }) {
  console.log("Card Movie Data:", movie); // Log the movie data passed to the Card component
  const imageUrl = decodeURIComponent(movie.thumbnail).replace(/^\/+/, "");  
  console.log("Decoded Image URL:", imageUrl);  // Log the image URL to check its validity

  return (
    <div className="card" onClick={onClick}>
      <img src={decodeURIComponent(movie.thumbnail).replace(/^\/+/, "")} alt={movie.title} className="card-thumbnail" />
      <div className="card-content">
        <h3>{movie.title}</h3>
        <p>{movie.description}</p>
        {actionButton || (
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onWatchLater(movie.id);
            }}
          >
            Watch Later
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
