import type { Mode, Rating } from "./types";

type WaitingTipKey = `${Mode}:${string}:${"speaker" | "listener"}`;
export const WAITING_TIPS: Partial<Record<WaitingTipKey, string>> = {
  // Raise a Concern
  "raise-concern:statement:listener":
    "You're about to paraphrase. Listen for three things: the feeling, the situation, and the need. Reflect them back in your own words — don't defend or explain yet.",
  "raise-concern:paraphrase:speaker":
    "Your partner is working to understand you. Take a breath — you'll get to confirm whether they got it right.",
  "raise-concern:confirm:listener":
    "Your partner is deciding whether your paraphrase felt accurate. If they say 'not quite', just try again — this is a skill, not a test.",

  // Check In
  "check-in:share-a:listener":
    "You're about to validate. When your partner shares, your only job is to understand and acknowledge — not to fix, advise, or relate it back to yourself.",
  "check-in:validate-a:speaker":
    "Your partner is responding to what you shared. Notice how it feels to be heard.",
  "check-in:share-b:speaker":
    "Now it's your turn to listen. Give your partner the same presence they gave you.",
  "check-in:validate-b:listener":
    "Your partner is responding to what you shared.",

  // Appreciate
  "appreciate:appreciate-a:listener":
    "Your partner is writing an appreciation for you. Receive it openly — let it land without deflecting.",
  "appreciate:acknowledge-a:speaker":
    "Your partner is reading your appreciation. Give them a moment to take it in.",
  "appreciate:appreciate-b:speaker":
    "Now it's your partner's turn. Think about something specific they've done recently that you're grateful for.",

  // Work Through It
  "work-through-it:speak-a:listener":
    "You're about to mirror. Your only goal is to reflect back what you heard — not to respond, argue, or explain your side yet.",
  "work-through-it:mirror-a:speaker":
    "Your partner is working to reflect your words. Stay open — they're trying to understand you.",
  "work-through-it:validate-a:speaker":
    "Your partner is validating your perspective. You don't need to respond — just notice how it feels to be understood.",
  "work-through-it:empathize-a:speaker":
    "Your partner is trying to imagine what you're feeling. Stay curious about their attempt.",
  "work-through-it:speak-b:speaker":
    "Now it's your partner's turn to share. Your job is to mirror, validate, and empathize — not defend yourself.",

  // Repair
  "repair:realities-a:listener":
    "Your partner is sharing their perspective on what happened. You'll summarize it next — focus on understanding, not rebuttal.",
  "repair:realities-b:speaker":
    "Your partner is summarizing your perspective. Notice if they captured how you felt.",
  "repair:triggers-a:listener":
    "Your partner is sharing what triggered them. This is about their internal experience — try to receive it without taking it personally.",
  "repair:responsibility-a:listener":
    "Your partner is naming what they regret. This is a vulnerable step — receive it with grace.",
  "repair:plan:speaker":
    "Your partner is committing to a change. Think about one specific, realistic thing you can do differently.",
  "repair:plan:listener":
    "Your partner is committing to a change. Think about one specific, realistic thing you can do differently.",
};

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
    whenToUse: "Daily/regular connection. Low stakes, builds habit.",
    basedOn: "Gottman Stress-Reducing Conversation",
    steps: ["waiting", "mode-select", "explainer", "share-a", "validate-a", "share-b", "validate-b", "rating", "results"] as const,
  },
  "appreciate": {
    name: "Appreciate",
    description: "Express gratitude for something specific",
    icon: "💛",
    ratingQuestion: "",
    whenToUse: "Build positivity, express gratitude.",
    basedOn: "Gottman Fondness & Admiration",
    steps: ["waiting", "mode-select", "explainer", "appreciate-a", "acknowledge-a", "appreciate-b", "acknowledge-b", "results"] as const,
  },
  "raise-concern": {
    name: "Raise a Concern",
    description: "Express a feeling constructively using 'I' statements",
    icon: "🤝",
    ratingQuestion: "Do you feel better?",
    whenToUse: "Something is bothering you and you need to express it constructively.",
    basedOn: "NVC + Gottman Softened Startup",
    steps: ["waiting", "mode-select", "explainer", "statement", "paraphrase", "confirm", "rating", "results"] as const,
  },
  "work-through-it": {
    name: "Work Through It",
    description: "Process a disagreement with structured dialogue",
    icon: "🔄",
    ratingQuestion: "Do you feel understood?",
    whenToUse: "Active disagreement that needs structured processing.",
    basedOn: "Imago Dialogue",
    steps: ["waiting", "mode-select", "explainer", "speak-a", "mirror-a", "validate-a", "empathize-a", "speak-b", "mirror-b", "validate-b", "empathize-b", "rating", "results"] as const,
  },
  "repair": {
    name: "Repair",
    description: "Process what happened after a conflict",
    icon: "🌱",
    ratingQuestion: "Do you feel this is resolved?",
    whenToUse: "After a blowup, to process what happened.",
    basedOn: "Gottman Aftermath of a Fight",
    steps: ["waiting", "mode-select", "explainer", "feelings", "realities-a", "realities-b", "triggers-a", "triggers-b", "responsibility-a", "responsibility-b", "plan", "rating", "results"] as const,
  },
} as const;

export const MODE_EXPLAINERS: Record<Mode, { bullets: string[] }> = {
  "check-in": {
    bullets: [
      "Person A shares what's on their mind (external stress, not about the relationship)",
      "Person B listens and responds with validation",
      "Roles swap — Person B shares, Person A validates",
      "Both rate how connected they feel",
    ],
  },
  "appreciate": {
    bullets: [
      "Person A fills in: \"I noticed when you [action] and it made me feel [emotion]\"",
      "Person B reads it and taps \"Thank you\"",
      "Roles swap — Person B appreciates, Person A acknowledges",
      "Both see a summary of what was shared",
    ],
  },
  "raise-concern": {
    bullets: [
      "Person A fills in: \"I feel [emotion] when [situation]. What I need is [request]\"",
      "Person B paraphrases: \"What I hear you saying is...\"",
      "Person A confirms whether the paraphrase felt accurate",
      "Both rate how they feel at the end",
    ],
  },
  "work-through-it": {
    bullets: [
      "Person A shares a few sentences about the issue",
      "Person B mirrors, validates, and empathizes",
      "Roles swap — Person B responds, Person A mirrors/validates/empathizes",
      "Both rate whether they feel understood",
    ],
  },
  "repair": {
    bullets: [
      "Both pick emotions they felt during the incident (no explaining why)",
      "Each shares their perspective with \"I\" statements",
      "Each shares what triggered them and takes responsibility",
      "Both commit to one thing they'll do differently",
    ],
  },
};

export function getNextModeSuggestion(
  mode: Mode,
  ratings: { speaker: Rating | null; listener: Rating | null }
): { mode: Mode; reason: string } | null {
  const { speaker, listener } = ratings;
  const bothNo = speaker === "no" && listener === "no";
  const bothYes = speaker === "yes" && listener === "yes";

  if (mode === "raise-concern" && bothNo) {
    return { mode: "work-through-it", reason: "Since it didn't fully resolve, try a deeper structured dialogue." };
  }
  if (mode === "check-in" && bothYes) {
    return { mode: "appreciate", reason: "You're feeling connected — this is a great time to express gratitude." };
  }
  if (mode === "work-through-it" && bothNo) {
    return { mode: "repair", reason: "If you've been through a tough moment, the Repair process can help." };
  }
  if (mode === "repair" && bothYes) {
    return { mode: "appreciate", reason: "Now that things feel resolved, celebrate each other with an appreciation." };
  }
  return null;
}
