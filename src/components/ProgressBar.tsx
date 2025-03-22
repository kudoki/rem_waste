import React, { useEffect } from "react";

import { useRef } from "react";

import { useState } from "react";
import { ProgressStep } from "../types";
import { motion } from "framer-motion";

const ProgressBar = () => {
  const [currentStepId, setCurrentStepId] = useState<string>("select-skip");
  const progressBarRef = useRef<HTMLDivElement>(null);

  const progressSteps: ProgressStep[] = [
    {
      id: "postcode",
      label: "Postcode",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      completed: true,
      active: false,
    },
    {
      id: "waste-type",
      label: "Waste Type",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      completed: true,
      active: false,
    },
    {
      id: "select-skip",
      label: "Select Skip",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      completed: false,
      active: true,
    },
    {
      id: "permit",
      label: "Permit Check",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      completed: false,
      active: false,
    },
    {
      id: "date",
      label: "Choose Date",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      completed: false,
      active: false,
    },
    {
      id: "payment",
      label: "Payment",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      completed: false,
      active: false,
    },
  ];

  const handleStepChange = (stepId: string) => {
    setCurrentStepId(stepId);
  };

  useEffect(() => {
    if (progressBarRef.current) {
      const activeStepIndex = progressSteps.findIndex(
        (step) => step.id === currentStepId
      );
      
      if (activeStepIndex !== -1) {
        const stepElements =
          progressBarRef.current.querySelectorAll(".progress-step");
        const activeElement = stepElements[activeStepIndex] as HTMLElement;

        if (activeElement) {
          const containerWidth = progressBarRef.current.offsetWidth;
          const scrollPosition =
            activeElement.offsetLeft -
            containerWidth / 2 +
            activeElement.offsetWidth / 2;

          progressBarRef.current.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentStepId, progressSteps]);

  return (
    <div className="container max-w-3xl mx-auto">
      {/* Progress bar container with fade effect */}
      <div className="relative py-12 flex justify-center">
        {/* Left fade effect */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 z-20 pointer-events-none lg:hidden" 
          style={{
            background: "linear-gradient(to right, white 20%, rgba(255, 255, 255, 0))"
          }}
        ></div>
        
        {/* Main scroll container - limited width on large screens and centered */}
        <div
          className="relative overflow-x-auto lg:overflow-visible"
          ref={progressBarRef}
          style={{ 
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          <div className="flex items-center min-w-max px-8 lg:px-0 lg:justify-center">
            {progressSteps.map((step, index) => {
              const isActive = step.id === currentStepId;
              const isCompleted =
                progressSteps.findIndex((s) => s.id === currentStepId) > index;
              const isLast = index === progressSteps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step indicator and label */}
                  <div
                    className={`
                    progress-step flex flex-col items-center cursor-pointer relative
                    ${isActive ? "text-green-500" : "text-gray-500"}
                  `}
                    onClick={() => handleStepChange(step.id)}
                  >
                    <div
                      className={`
                      w-10 h-10 relative rounded-full flex items-center justify-center z-10 transition-colors
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-white border-2 border-green-500 text-green-500"
                          : "bg-white border-2 border-gray-200 text-gray-400"
                      }
                    `}
                    >
                      {step.icon}
                    </div>
                    <div className="text-xs font-medium text-center mt-2 w-24">
                      {step.label}
                    </div>
                  </div>

                  {/* Connecting line between circles */}
                  {!isLast && (
                    <div className="w-12 md:w-16 mx-1 flex items-center">
                      <div className="h-1 relative w-full">
                        {/* Background line */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, #e5e7eb, #e5e7eb 4px, transparent 4px, transparent 9px)",
                          }}
                        ></div>

                        {/* Colored progress line */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, #10b981, #10b981 4px, transparent 4px, transparent 9px)",
                          }}
                          initial={{ width: "0%" }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Right fade effect */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 z-20 pointer-events-none lg:hidden" 
          style={{
            background: "linear-gradient(to left, white 20%, rgba(255, 255, 255, 0))"
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
