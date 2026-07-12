import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getExercises } from "../services/exercises";
import { getExerciseProgress } from "../services/progress";
import type { Exercise } from "../types/exercise";
import type { ExerciseProgressResponse } from "../types/progress";

function Progress() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [progress, setProgress] = useState<ExerciseProgressResponse | null>(
    null
  );
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        setError("");
        const data = await getExercises();
        setExercises(data);

        if (data.length > 0) {
          setSelectedExerciseId(data[0].id);
        }
      } catch {
        setError("Unable to load exercises.");
      } finally {
        setIsLoadingExercises(false);
      }
    }

    loadExercises();
  }, []);

  useEffect(() => {
    async function loadProgress() {
      if (!selectedExerciseId) {
        return;
      }

      try {
        setIsLoadingProgress(true);
        setError("");

        const data = await getExerciseProgress(selectedExerciseId);
        setProgress(data);
      } catch {
        setError("Unable to load exercise progress.");
      } finally {
        setIsLoadingProgress(false);
      }
    }

    loadProgress();
  }, [selectedExerciseId]);

  const chartData =
    progress?.entries.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight,
      volume: entry.volume,
    })) ?? [];

  return (
    <main>
      <div className="page-header">
        <h1>Progress</h1>
        <p>Track strength progress by exercise.</p>
      </div>
      
      {error && <p>{error}</p>}

      {isLoadingExercises ? (
        <p>Loading exercises...</p>
      ) : exercises.length === 0 ? (
        <p>Add exercises and log workouts before viewing progress.</p>
      ) : (
        <>
          <div>
            <label htmlFor="exercise">Exercise</label>
            <select
              id="exercise"
              value={selectedExerciseId}
              onChange={(event) => setSelectedExerciseId(event.target.value)}
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          <p></p>

          {isLoadingProgress ? (
            <p>Loading progress...</p>
          ) : progress ? (
            <section className="card">
              <h2>{progress.exercise.name}</h2>

              <p>Max weight: {progress.summary.maxWeight} kg</p>
              <p>Total volume lifted: {progress.summary.totalVolume} kg</p>
              <p>Total sets: {progress.summary.totalSets}</p>

              {chartData.length > 0 ? (
                <LineChart width={700} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" />
                </LineChart>
              ) : (
                <p>No workout data for this exercise yet.</p>
              )}

              <h3>History</h3>

              <ul>
                {progress.entries.map((entry, index) => (
                  <li key={`${entry.date}-${entry.setNumber}-${index}`}>
                    {new Date(entry.date).toLocaleDateString()} —{" "}
                    {entry.workoutTitle}: {entry.reps} reps × {entry.weight}{" "}
                    {entry.unit}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}

export default Progress;