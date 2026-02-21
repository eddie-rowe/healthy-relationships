export const EMOTIONS = [
  "Hurt", "Sad", "Angry", "Frustrated", "Anxious",
  "Scared", "Lonely", "Overwhelmed", "Disappointed", "Confused",
  "Embarrassed", "Guilty", "Jealous", "Resentful", "Hopeless",
  "Numb", "Defensive", "Misunderstood", "Unappreciated", "Exhausted",
];

export const POSITIVE_EMOTIONS = [
  "Happy", "Grateful", "Loved", "Appreciated", "Proud",
  "Hopeful", "Calm", "Connected", "Safe", "Supported",
  "Joyful", "Inspired", "Relieved", "Confident", "Valued",
];

export const VALIDATION_PROMPTS = [
  "That sounds really hard",
  "How are you feeling about that?",
  "I'm here for you",
  "That makes sense",
  "I can see why that would bother you",
  "Thank you for sharing that with me",
];

export const MODE_CONFIG = {
  "check-in": {
    name: "Check In",
    description: "Share what's on your mind and feel heard",
    icon: "💬",
    ratingQuestion: "Do you feel more connected?",
    steps: ["waiting", "mode-select", "share-a", "validate-a", "share-b", "validate-b", "rating", "results"] as const,
  },
  "appreciate": {
    name: "Appreciate",
    description: "Express gratitude for something specific",
    icon: "💛",
    ratingQuestion: "",
    steps: ["waiting", "mode-select", "appreciate-a", "acknowledge-a", "appreciate-b", "acknowledge-b", "results"] as const,
  },
  "raise-concern": {
    name: "Raise a Concern",
    description: "Express a feeling constructively using 'I' statements",
    icon: "🤝",
    ratingQuestion: "Do you feel better?",
    steps: ["waiting", "mode-select", "statement", "paraphrase", "confirm", "rating", "results"] as const,
  },
  "work-through-it": {
    name: "Work Through It",
    description: "Process a disagreement with structured dialogue",
    icon: "🔄",
    ratingQuestion: "Do you feel understood?",
    steps: ["waiting", "mode-select", "speak-a", "mirror-a", "validate-a", "empathize-a", "speak-b", "mirror-b", "validate-b", "empathize-b", "rating", "results"] as const,
  },
  "repair": {
    name: "Repair",
    description: "Process what happened after a conflict",
    icon: "🌱",
    ratingQuestion: "Do you feel this is resolved?",
    steps: ["waiting", "mode-select", "feelings", "realities-a", "realities-b", "triggers-a", "triggers-b", "responsibility-a", "responsibility-b", "plan", "rating", "results"] as const,
  },
} as const;
