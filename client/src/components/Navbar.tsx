import { Link, useNavigate } from "react-router-dom";
import { clearAuthStorage, getStoredToken } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getStoredToken());

  function handleLogout() {
    clearAuthStorage();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">GymRat</Link>{" "}

      {isLoggedIn ? (
        <>
          <Link to="/dashboard">Dashboard</Link>{" "}
          <Link to="/exercises">Exercises</Link>{" "}
          <Link to="/workouts">Workouts</Link>{" "}
          <Link to="/workouts/new">Log Workout</Link>{" "}
          <Link to="/progress">Progress</Link>{" "}
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;