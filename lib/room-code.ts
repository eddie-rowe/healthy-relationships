const WORDS = [
  "BEAR", "MOON", "STAR", "WAVE", "TREE",
  "BIRD", "LEAF", "RAIN", "SNOW", "FERN",
  "DAWN", "LAKE", "ROSE", "DEER", "IRIS",
  "SAGE",
];

export function generateRoomCode(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${word}${num}`;
}
