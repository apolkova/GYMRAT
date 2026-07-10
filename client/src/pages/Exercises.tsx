import { useEffect, useState } from "react";
import {
  createExercise,
  getExercises,
  type CreateExerciseInput,
} from "../services/exercises";
import type { Exercise } from "../types/exercise";

function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<CreateExerciseInput>({
    name: "",
    muscleGroup: "",
    equipment: "",
    instructions: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.muscleGroup) {
      setError("Exercise name and muscle group are required.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const newExercise = await createExercise({
        name: form.name,
        muscleGroup: form.muscleGroup,
        equipment: form.equipment || undefined,
        instructions: form.instructions || undefined,
      });

      setExercises((currentExercises) => [...currentExercises, newExercise]);

      setForm({
        name: "",
        muscleGroup: "",
        equipment: "",
        instructions: "",
      });
    } catch {
      setError("Unable to create exercise.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main>
      <h1>Exercises</h1>
      <p>Create and manage exercises for your workouts.</p>

      {error && <p>{error}</p>}

      <section>
        <h2>Add Exercise</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Exercise name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Bench Press"
            />
          </div>

          <div>
            <label htmlFor="muscleGroup">Muscle group</label>
            <input
              id="muscleGroup"
              name="muscleGroup"
              value={form.muscleGroup}
              onChange={handleChange}
              placeholder="Chest"
            />
          </div>

          <div>
            <label htmlFor="equipment">Equipment</label>
            <input
              id="equipment"
              name="equipment"
              value={form.equipment}
              onChange={handleChange}
              placeholder="Barbell"
            />
          </div>

          <div>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Keep your shoulder blades retracted."
            />
          </div>

          <button type="submit" disabled={isCreating}>
            {isCreating ? "Adding..." : "Add Exercise"}
          </button>
        </form>
      </section>

      <section>
        <h2>Exercise Library</h2>

        {isLoading ? (
          <p>Loading exercises...</p>
        ) : exercises.length === 0 ? (
          <p>No exercises yet. Add your first exercise above.</p>
        ) : (
          <ul>
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.name}</strong> — {exercise.muscleGroup}
                {exercise.equipment && <> — {exercise.equipment}</>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Exercises;