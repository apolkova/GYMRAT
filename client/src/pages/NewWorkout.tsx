import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExercises } from "../services/exercises";
import { createWorkout } from "../services/workouts";
import type { Exercise } from "../types/exercise";
import type { CreateWorkoutSetInput } from "../types/workout";

type WorkoutSetForm = {
  exerciseId: string;
  reps: string;
  weight: string;
  unit: string;
};

function NewWorkout() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sets, setSets] = useState<WorkoutSetForm[]>([
    {
      exerciseId: "",
      reps: "",
      weight: "",
      unit: "lb",
    },
  ]);

  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        setError("");
        const data = await getExercises();
        setExercises(data);
      } catch {
        setError("Unable to load exercises.");
      } finally {
        setIsLoadingExercises(false);
      }
    }

    loadExercises();
  }, []);

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
        unit: "lb",
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
      const weight = Number(set.weight);

      if (Number.isNaN(reps) || Number.isNaN(weight)) {
        setError("Reps and weight must be valid numbers.");
        return;
      }

      formattedSets.push({
        exerciseId: set.exerciseId,
        setNumber: index + 1,
        reps,
        weight,
        unit: set.unit || "lb",
      });
    }

    try {
      setIsSaving(true);
      setError("");

      await createWorkout({
        title,
        notes: notes || undefined,
        sets: formattedSets,
      });

      navigate("/workouts");
    } catch {
      setError("Unable to create workout.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main>
      <h1>Log Workout</h1>
      <p>Create a workout with exercises, sets, reps, and weight.</p>

      {error && <p>{error}</p>}

      {isLoadingExercises ? (
        <p>Loading exercises...</p>
      ) : exercises.length === 0 ? (
        <p>
          You need to add exercises before logging a workout. Go to the
          Exercises page first.
        </p>
      ) : (
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
                    type="number"
                    value={set.weight}
                    onChange={(event) =>
                      updateSet(index, "weight", event.target.value)
                    }
                    placeholder="135"
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
            {isSaving ? "Saving..." : "Save workout"}
          </button>
        </form>
      )}
    </main>
  );
}

export default NewWorkout;