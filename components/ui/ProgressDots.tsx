"use client";

interface ProgressDotsProps {
  currentStep: string;
  totalSteps: readonly string[];
}

const SKIP_STEPS = new Set(["waiting", "mode-select", "explainer", "results"]);

export default function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  const sessionSteps = totalSteps.filter((s) => !SKIP_STEPS.has(s));
  const currentIndex = sessionSteps.indexOf(currentStep);

  if (currentIndex < 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4" role="status" aria-label={`Step ${currentIndex + 1} of ${sessionSteps.length}`}>
      {sessionSteps.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div
            key={step}
            className={`rounded-full transition-all ${
              isDone
                ? "w-2.5 h-2.5 bg-violet-500"
                : isCurrent
                ? "w-2.5 h-2.5 bg-violet-600 ring-2 ring-violet-200"
                : "w-2 h-2 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        );
      })}
    </div>
  );
}
