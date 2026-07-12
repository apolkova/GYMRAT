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
      <div className="page-header">
        <h1>Workouts</h1>
        <p>Review your logged workouts.</p>
      </div>

      <div className="button-row">
        <Link
          to="/workouts/new"
          state={{ fromWorkouts: true }}
          className="btn btn-primary"
        >
          Log a new workout
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {isLoading ? (
        <p>Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <ul className="card-list">
          {workouts.map((workout) => (
            <li key={workout.id} className="card">
              <Link to={`/workouts/${workout.id}`}>
                <strong>{workout.title}</strong>
              </Link>

              <p className="muted">
                {new Date(workout.date).toLocaleDateString()}
              </p>

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