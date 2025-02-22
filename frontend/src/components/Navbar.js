import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/authSlice";
import axios from 'axios';

function Navbar() {
    var user = useSelector(store=>store.auth.user);
    const dispatch = useDispatch ();
    const navigate = useNavigate();
    function logout(){
        if(user){
            axios.post('http://127.0.0.1:8000/logout_api',{},{
                headers:{"Content-Type":"application/json",
                    'Authorization':`Token ${user.token}`
                }
        });
            dispatch(removeUser());
            navigate('/login');
        }
    }
    return <nav className="navbar navbar-expand-sm navbar-dark bg-warning">
        <div className="navbar-brand">
            <h4>Movie World</h4>
        </div>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}
        >
            <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                <li className="nav-item">
                <NavLink to={"/"} className="nav-link">
                    <b>Home</b>
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/viewmovie"} className="nav-link">
                    <b>View Movie</b>
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/changepsswd"} className="nav-link">
                    <b>Change Password</b>
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/watchlist"} className="nav-link">
                    <b>watchList</b> 
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/watchhistory"} className="nav-link">
                    <b>watchHistory</b>
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/register"} className="nav-link">
                    <b>Register</b>
                </NavLink>
                </li>

                {user?
                <li className="nav-item">
                    <span className="nav-link" onClick={logout}>Logout</span>
                </li>:
                <li className="nav-item">
                <NavLink 
                to={"/login"} 
                className={
                    'nav-link '+
                    (status => status.isActive ? 'active' : '')
                } 
                >
                    Login
                </NavLink>
                </li>
            }

            </ul>
        </div>
    </nav>
}

export default Navbar;