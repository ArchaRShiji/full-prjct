import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/register";
import Login from "./components/login";
import ViewMovie from "./components/viewMovie";
import WatchHistory from "./components/watchhistory";
import WatchList from "./components/watchlist";
import ChangePsswd from "./components/changePsswd";
import MovieDetailsPage from "./components/movieDetails";

const router = createBrowserRouter([
    {path: '', element: <App/> },
    {path: 'register',element:<Register/>},
    {path:'login',element:<Login/>},
    {path: 'viewmovie',element:<ViewMovie/>},
    {path:'watchlist',element:<WatchList/>},
    {path:'watchhistory',element:<WatchHistory/>},
    {path:'changepsswd',element:<ChangePsswd/>},
    {path: 'movie/:id', element: <MovieDetailsPage/> },
]);

export default router;