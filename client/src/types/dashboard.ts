export type DashboardSummary = {
  totalWorkouts: number;
  totalSets: number;
  totalVolumeKg: number;
  latestWorkout: {
    id: string;
    title: string;
    date: string;
  } | null;
};