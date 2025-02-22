import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <header className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to Movie World</h1>
          <p>Your one-stop destination for all things movies!</p>
        </div>
      </header>
      <section className="intro">
        <h2>About Movie World</h2>
        <p>
          Movie World is a platform dedicated to providing movie lovers with the latest movie
          listings, trailers, reviews, and more. Explore movies by genre, release date, and ratings
          to find your next favorite film.
        </p>
      </section>
      <footer>
        <p>&copy; 2025 Movie World. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
