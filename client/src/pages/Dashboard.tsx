import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboard";
import type { DashboardSummary } from "../types/dashboard";
import type { AuthUser } from "../types/auth";

function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("gymrat_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser) as AuthUser);
    }

    async function loadSummary() {
      try {
        setError("");
        const data = await getDashboardSummary();
        setSummary(data);
      } catch {
        setError("Unable to load dashboard summary.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSummary();
  }, []);

  function handleLogout() {
    localStorage.removeItem("gymrat_token");
    localStorage.removeItem("gymrat_user");
    window.location.href = "/login";
  }

  return (
    <main>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back to GymRat.</p>
      </div>

      {user && <p>Welcome, {user.name || user.email}.</p>}

      <p></p>

      <section className="card">
        <h2>Workout Summary</h2>

        {error && <p>{error}</p>}

        {isLoading ? (
          <p>Loading summary...</p>
        ) : summary ? (
          <div>
            <p>Total workouts: {summary.totalWorkouts}</p>
            <p>Total sets: {summary.totalSets}</p>
            <p>Total volume: {summary.totalVolumeKg} kg</p>

            {summary.latestWorkout ? (
              <p>
                Latest workout: {summary.latestWorkout.title} on{" "}
                {new Date(summary.latestWorkout.date).toLocaleDateString()}
              </p>
            ) : (
              <p>No workouts logged yet.</p>
            )}
          </div>
        ) : (
          <p>No summary available.</p>
        )}
      </section>
    </main>
  );
}

export default Dashboard;