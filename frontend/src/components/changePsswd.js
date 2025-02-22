import React from "react";
import Navbar from "./Navbar";
import {useState} from "react";
import axios from "axios";

function ChangePsswd(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ChangePsswd", 
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      setError("");
    } catch (err) {
      setError("Error changing password.");
      setSuccess("");
    }
  };
    return(
        <div>
            <Navbar /> {/* Navbar included at the top */}
      <div className="register-container"> {/* Using the same container class for styling */}
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="register-btn">Change Password</button>
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
        </div>
    );
}
export default ChangePsswd;