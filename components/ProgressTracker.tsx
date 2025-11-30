import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep }) => {
  const getStepStatus = (index: number): 'completed' | 'in-progress' | 'pending' => {
    if (currentStep !== undefined) {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'in-progress';
      return 'pending';
    }
    return steps[index]?.status || 'pending';
  };

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-[#1F4AA8] mb-4 flex items-center">
        <div className="w-2 h-2 bg-[#153A73] rounded-full mr-2" />
        Progress Tracker
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <div className="w-8 h-8 rounded-full bg-[#1F4AA8] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  ) : status === 'in-progress' ? (
                    <div className="w-8 h-8 rounded-full bg-[#4C86FF] flex items-center justify-center animate-pulse">
                      <Circle className="w-5 h-5 text-white fill-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#E6E9EF] flex items-center justify-center">
                      <Circle className="w-5 h-5 text-[#737373]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === 'completed' ? 'text-[#1F4AA8]' :
                    status === 'in-progress' ? 'text-[#4C86FF]' :
                    'text-[#737373]'
                  }`}>
                    {step.label}
                  </p>
                  {status === 'in-progress' && (
                    <div className="mt-1 w-full bg-[#E6E9EF] rounded-full h-1.5">
                      <div className="bg-[#4C86FF] h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className={`absolute left-4 top-10 w-0.5 h-6 ${
                  status === 'completed' ? 'bg-[#1F4AA8]' : 'bg-[#E6E9EF]'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;

