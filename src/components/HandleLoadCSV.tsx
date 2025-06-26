type Ratings = {
  selfLove: number;
  mindfulness: number;
  confident: number;
  health: number;
  relationship: number;
  creativity: number;
  career: number;
  financial: number;
};

const handleLoadCSV = (
  fileKey: string,
  setStateFunctions: {
    setSleepHours: (v: string) => void;
    setMood: (v: string) => void;
    setThoughts: (v: string) => void;
    setYesterdayBest: (v: string) => void;
    setGrateful: (v: string) => void;
    setImprovement: (v: string) => void;
    setReward: (v: string) => void;
    setTodaySchedule: (v: string) => void;
    setDreamGoals: (v: { small: string; big: string }) => void;
    setAchievementIdeas: (v: string[]) => void;
    setCreativity: (v: string) => void;
    setRatings: (v: Ratings) => void;
  },
) => {
  const data = localStorage.getItem(fileKey);
  if (!data) return;

  const rows = data.split("\n").map(
    (row) => row.split(",").map((cell) => cell.replace(/(^"|"$)/g, "")), // Remove quotes
  );

  const dataMap = Object.fromEntries(rows.slice(1)); // Skip header

  const {
    setSleepHours,
    setMood,
    setThoughts,
    setYesterdayBest,
    setGrateful,
    setImprovement,
    setReward,
    setTodaySchedule,
    setDreamGoals,
    setAchievementIdeas,
    setCreativity,
    setRatings,
  } = setStateFunctions;

  setSleepHours(dataMap["Sleep Hours"] ?? "");
  setMood(dataMap["Mood"] ?? "");
  setThoughts(dataMap["Thoughts"] ?? "");
  setYesterdayBest(dataMap["Yesterday Best"] ?? "");
  setGrateful(dataMap["Grateful For"] ?? "");
  setImprovement(dataMap["Areas for Improvement"] ?? "");
  setReward(dataMap["Reward to Myself After"] ?? "");
  setTodaySchedule(dataMap["Today's Schedule"] ?? "");
  setDreamGoals({
    small: dataMap["Dream Come True (Small)"] ?? "",
    big: dataMap["Dream Come True (Big)"] ?? "",
  });
  setAchievementIdeas((dataMap["20 Ideas"] ?? "").split(";"));
  setCreativity(dataMap["Think Outside Box"] ?? "");

  setRatings({
    selfLove: Number(dataMap["Self Love Rating"] ?? 0),
    mindfulness: Number(dataMap["Mindfulness Rating"] ?? 0),
    confident: Number(dataMap["Confidence Rating"] ?? 0),
    health: Number(dataMap["Health Rating"] ?? 0),
    relationship: Number(dataMap["Relationship Rating"] ?? 0),
    creativity: Number(dataMap["Creativity Rating"] ?? 0),
    career: Number(dataMap["Career Rating"] ?? 0),
    financial: Number(dataMap["Financial Rating"] ?? 0),
  });
};
