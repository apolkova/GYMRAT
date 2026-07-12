import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteWorkout, getWorkoutById } from "../services/workouts";
import type { Workout } from "../types/workout";

function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkout() {
      if (!id) {
        setError("Workout id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        const data = await getWorkoutById(id);
        setWorkout(data);
      } catch {
        setError("Unable to load workout.");
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkout();
  }, [id]);

  async function handleDelete() {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteWorkout(id);
      navigate("/workouts");
    } catch {
      setError("Unable to delete workout.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEdit() {
    if (!workout) {
      return;
    }

    navigate(`/workouts/${workout.id}/edit`);
  }

  const totalVolumeKg =
    workout?.sets.reduce((sum, set) => {
      return sum + set.reps * set.weight;
    }, 0) ?? 0;

  return (
    <main>
      <div className="page-header">
        <p>
          <Link to="/workouts" className="muted">
            ← Back to workouts
          </Link>
        </p>

        {isLoading ? (
          <>
            <h1>Workout</h1>
            <p>Loading workout...</p>
          </>
        ) : workout ? (
          <>
            <h1>{workout.title}</h1>
            <p>{new Date(workout.date).toLocaleDateString()}</p>
          </>
        ) : (
          <>
            <h1>Workout</h1>
            <p>Workout not found.</p>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {isLoading ? (
        <section className="card">
          <p>Loading workout...</p>
        </section>
      ) : workout ? (
        <section className="card">
          {workout.notes && <p>{workout.notes}</p>}

          <div className="stat-grid">
            <div className="card">
              <p className="muted">Total volume lifted</p>
              <p className="stat-value">{totalVolumeKg} kg</p>
            </div>

            <div className="card">
              <p className="muted">Total sets</p>
              <p className="stat-value">{workout.sets.length}</p>
            </div>

            <div className="card">
              <p className="muted">Date</p>
              <p className="stat-value">
                {new Date(workout.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <section>
            <h2>Sets</h2>

            <ul className="card-list">
              {workout.sets.map((set) => (
                <li key={set.id} className="card">
                  <strong>
                    Set {set.setNumber}: {set.exercise.name}
                  </strong>
                  <p>
                    {set.reps} reps × {set.weight} {set.unit}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="button-row">
            <button type="button" className="btn btn-secondary" onClick={handleEdit}>
              Edit workout
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete workout"}
            </button>
          </div>
        </section>
      ) : (
        <section className="card">
          <p>Workout not found.</p>
        </section>
      )}
    </main>
  );
}

export default WorkoutDetail;