import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getExercises } from "../services/exercises";
import { getWorkoutById, updateWorkout } from "../services/workouts";
import type { Exercise } from "../types/exercise";
import type { CreateWorkoutSetInput, Workout } from "../types/workout";

type WorkoutSetForm = {
  exerciseId: string;
  reps: string;
  weight: string;
  unit: string;
};

function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sets, setSets] = useState<WorkoutSetForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError("Workout id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const [exerciseData, workoutData] = await Promise.all([
          getExercises(),
          getWorkoutById(id),
        ]);

        setExercises(exerciseData);
        setWorkout(workoutData);
        setTitle(workoutData.title);
        setNotes(workoutData.notes ?? "");

        setSets(
          workoutData.sets.map((set) => ({
            exerciseId: set.exerciseId,
            reps: String(set.reps),
            weight: String(set.weight),
            unit: set.unit || "kg",
          }))
        );
      } catch {
        setError("Unable to load workout.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  function updateSet(index: number, field: keyof WorkoutSetForm, value: string) {
    setSets((currentSets) =>
      currentSets.map((set, currentIndex) =>
        currentIndex === index
          ? {
              ...set,
              [field]: value,
            }
          : set
      )
    );
  }

  function addSet() {
    setSets((currentSets) => [
      ...currentSets,
      {
        exerciseId: "",
        reps: "",
        weight: "",
        unit: "kg",
      },
    ]);
  }

  function removeSet(index: number) {
    setSets((currentSets) =>
      currentSets.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    if (!title.trim()) {
      setError("Workout title is required.");
      return;
    }

    if (sets.length === 0) {
      setError("At least one set is required.");
      return;
    }

    const formattedSets: CreateWorkoutSetInput[] = [];

    for (let index = 0; index < sets.length; index++) {
      const set = sets[index];

      if (!set.exerciseId || !set.reps || !set.weight) {
        setError("Each set must include exercise, reps, and weight.");
        return;
      }

      const reps = Number(set.reps);
      const weight = Number(set.weight.replace(",", "."));

      if (Number.isNaN(reps) || Number.isNaN(weight)) {
        setError("Reps and weight must be valid numbers.");
        return;
      }

      formattedSets.push({
        exerciseId: set.exerciseId,
        setNumber: index + 1,
        reps,
        weight,
        unit: set.unit || "kg",
      });
    }

    try {
      setIsSaving(true);
      setError("");

      await updateWorkout(id, {
        title,
        notes: notes || undefined,
        sets: formattedSets,
      });

      navigate(`/workouts/${id}`);
    } catch {
      setError("Unable to update workout.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main>
      <p>
        <Link to={id ? `/workouts/${id}` : "/workouts"}>Back to workout</Link>
      </p>

      <h1>Edit Workout</h1>

      {error && <p>{error}</p>}

      {isLoading ? (
        <p>Loading workout...</p>
      ) : workout ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Workout title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Push Day"
            />
          </div>

          <div>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Felt strong today."
            />
          </div>

          <section>
            <h2>Sets</h2>

            {sets.map((set, index) => (
              <div key={index}>
                <h3>Set {index + 1}</h3>

                <div>
                  <label>Exercise</label>
                  <select
                    value={set.exerciseId}
                    onChange={(event) =>
                      updateSet(index, "exerciseId", event.target.value)
                    }
                  >
                    <option value="">Select exercise</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(event) =>
                      updateSet(index, "reps", event.target.value)
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <label>Weight</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={set.weight}
                    onChange={(event) =>
                      updateSet(index, "weight", event.target.value)
                    }
                    placeholder="20"
                  />
                </div>

                <div>
                  <label>Unit</label>
                  <select
                    value={set.unit}
                    onChange={(event) =>
                      updateSet(index, "unit", event.target.value)
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>

                {sets.length > 1 && (
                  <button type="button" onClick={() => removeSet(index)}>
                    Remove set
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addSet}>
              Add another set
            </button>
          </section>

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : (
        <p>Workout not found.</p>
      )}
    </main>
  );
}

export default EditWorkout;