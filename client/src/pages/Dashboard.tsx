import { useEffect, useState } from "react";
import type { AuthUser } from "../types/auth";

function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("gymrat_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser) as AuthUser);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("gymrat_token");
    localStorage.removeItem("gymrat_user");
    window.location.href = "/login";
  }

  return (
    <main>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p>Welcome, {user.name || user.email}.</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}

      <section>
        <h2>Workout Summary</h2>
        <p>Your workout summary will appear here.</p>
      </section>
    </main>
  );
}

export default Dashboard;