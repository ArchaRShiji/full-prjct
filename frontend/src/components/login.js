import React from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from '../store/authSlice'
import checkGuest from "./checkGuest";

function Login() {
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errorMessage, setErrorMessage] = useState('');
  var navigate = useNavigate();
  const dispatch = useDispatch();
  
  function attemptLogin(event) {
    event.preventDefault()
    axios.post('http://127.0.0.1:8000/apiLogin',{
      email:email,
      password:password
  }).then(response=>{
      setErrorMessage('')
      var user = {
        id: response.data.user.id,
        email: response.data.user.email,
        token:response.data.token
      }
      //localStorage.setItem("user", JSON.stringify(userData));
      dispatch(setUser(user));
      navigate('/viewmovie');
  }).catch(error=>{
      if(error.response.data.errors){
          setErrorMessage(Object.values(error.response.data.errors).join(' '))
      }else if(error.response.data.message){
          setErrorMessage(error.response.data.message)
      }else{
          setErrorMessage('Failed to login user. Please contact admin')
      }
  })
  }
  return (
    <div>
      <Navbar /> {/* Navbar included at the top */}
      <div className="register-container"> {/* Using the same container class for styling */}
        <h2>Login</h2>
        {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onInput={(event)=>setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onInput={(event)=>setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="register-btn" onClick={attemptLogin}>Login</button>
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default checkGuest(Login);
