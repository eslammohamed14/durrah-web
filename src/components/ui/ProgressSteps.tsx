"use client";

/**
 * ProgressSteps — visual step indicator for multi-step flows.
 * Shows completed, current, and upcoming steps.
 *
 * Requirements: 21.6
 */

interface Step {
  id: string;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
}: ProgressStepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Progress"
      className={["flex items-center gap-0", className]
        .filter(Boolean)
        .join(" ")}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isCurrent
                      ? "border-2 border-blue-600 bg-white text-blue-600"
                      : "border-2 border-gray-300 bg-white text-gray-400",
                ].join(" ")}
              >
                {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
              </div>
              <span
                className={[
                  "mt-1 whitespace-nowrap text-xs",
                  isCurrent
                    ? "font-semibold text-blue-600"
                    : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {index < steps.length - 1 && (
              <div
                aria-hidden="true"
                className={[
                  "mx-2 mb-5 h-0.5 w-12 sm:w-20",
                  index < currentIndex ? "bg-blue-600" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
