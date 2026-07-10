import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts } from "../services/workouts";
import type { Workout } from "../types/workout";

function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        setError("");
        const data = await getWorkouts();
        setWorkouts(data);
      } catch {
        setError("Unable to load workouts.");
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  return (
    <main>
      <h1>Workouts</h1>
      <p>Review your logged workouts.</p>

      <p>
        <Link to="/workouts/new">Log a new workout</Link>
      </p>

      {error && <p>{error}</p>}

      {isLoading ? (
        <p>Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <strong>{workout.title}</strong>{" "}
              <span>{new Date(workout.date).toLocaleDateString()}</span>

              {workout.notes && <p>{workout.notes}</p>}

              <ul>
                {workout.sets.map((set) => (
                  <li key={set.id}>
                    {set.exercise.name}: {set.reps} reps × {set.weight}{" "}
                    {set.unit}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Workouts;