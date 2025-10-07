import React from "react";

const ProgressBar = ({ currentStep }) => {
  // Define all steps in the booking process
  const steps = ["Time", "Seats", "Snacks", "Payment", "Confirmation"];

  // Find the index of the current step
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="mb-10">
      {/* Desktop version: full horizontal progress bar */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = stepIndex > index; // Steps before current step
          const isCurrent = step === currentStep; // The active/current step

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Circle representing step */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold z-10
                  ${
                    isCurrent
                      ? "bg-black border-black text-white" // Active step styling
                      : isCompleted
                      ? "bg-black border-black text-white" // Completed step styling
                      : "bg-gray-200 border-gray-300 text-gray-500" // Pending step styling
                  }`}
              >
                {index + 1} {/* Step number */}
              </div>

              {/* Step label */}
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent || isCompleted ? "text-black" : "text-gray-500"
                }`}
              >
                {step}
              </span>

              {/* Connector line to next step */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2
                    ${isCompleted ? "bg-black" : "bg-gray-300"}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile version: simplified with dots and step text */}
      <div className="flex flex-col items-center md:hidden space-y-2">
        {/* Dots indicator for each step */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === stepIndex
                  ? "bg-black" // Active step
                  : index < stepIndex
                  ? "bg-gray-500" // Completed steps
                  : "bg-gray-300" // Pending steps
              }`}
            ></span>
          ))}
        </div>

        {/* Step description below the dots */}
        <div className="text-sm font-medium text-center w-full border-b border-gray-300 pb-2">
          Step {stepIndex + 1} of {steps.length}: {currentStep}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
