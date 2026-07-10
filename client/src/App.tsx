import './App.css'
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exercises from "./pages/Exercises";
import NewWorkout from "./pages/NewWorkout";
import Workouts from "./pages/Workouts";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <section id="center">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <Exercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/new"
            element={
              <ProtectedRoute>
                <NewWorkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </section>

      
    </>
  );
}

export default App
