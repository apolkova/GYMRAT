import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getWorkoutById, deleteWorkout } from "../services/workouts";
import type { Workout } from "../types/workout";

function WorkoutDetail() {
  const { id } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const totalVolumeKg =
    workout?.sets.reduce((sum, set) => {
      return sum + set.reps * set.weight;
    }, 0) ?? 0;

  return (
    <main>
      <p>
        <Link to="/workouts">Back to workouts</Link>
      </p>

      {error && <p>{error}</p>}

      {isLoading ? (
        <p>Loading workout...</p>
      ) : workout ? (
        <>
          <h1>{workout.title}</h1>

          <p>{new Date(workout.date).toLocaleDateString()}</p>

          {workout.notes && <p>{workout.notes}</p>}

          <p>Total volume lifted: {totalVolumeKg} kg</p>

          <section>
            <h2>Sets</h2>

            <ul>
              {workout.sets.map((set) => (
                <li key={set.id}>
                  Set {set.setNumber}: {set.exercise.name} — {set.reps} reps ×{" "}
                  {set.weight} {set.unit}
                </li>
              ))}
            </ul>
          </section>

          <button type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete workout"}
          </button>
          
        </>
      ) : (
        <p>Workout not found.</p>
      )}
    </main>
  );
}

export default WorkoutDetail;