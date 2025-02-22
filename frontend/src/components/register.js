import React from 'react';
import Navbar from './Navbar';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [passwordConf, setPasswordConf] = useState('');
  var [errorMessage, setErrorMessage] = useState('');
  var navigate = useNavigate();

  function registerUser(event){
    event.preventDefault();
    if (password !== passwordConf) {
      setErrorMessage("Passwords do not match");
      return;
    }
    var user = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConf
    }
    axios.post('http://127.0.0.1:8000/apiSignup',user).then(response=>{
      setErrorMessage('');
      navigate('/login');
  }).catch(error => {
    if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessage(Object.values(error.response.data.errors).join(' '));
    } else {
        setErrorMessage('Failed to connect to the API or unexpected error');
    }
});

  }
  return (
    <div>
        <Navbar/>
    <div className="register-container">
      <h2>Register</h2>
      {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Enter your username" 
            onInput={(event)=>setName(event.target.value)}
            />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your email" 
            onInput={(event)=>setEmail(event.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter your password" 
            onInput={(event)=>setPassword(event.target.value)}
            />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword"
            placeholder="Confirm your password"
            onInput={(event)=>setPasswordConf(event.target.value)}
            />
        </div>
        <button 
          type="submit" 
          className="register-btn"
          onClick={registerUser}>
            Register
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
    </div>
  );
}

export default Register;
