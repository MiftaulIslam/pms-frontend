import { BoardingProvider, useBoardingContext } from './boarding-context';
import { Step1Name } from './steps/step1-name';
import { Step2Avatar } from './steps/step2-avatar';
import { Step3HeardFrom } from './steps/step3-heard-from';
import { Step4Interests } from './steps/step4-interests';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const steps = [
  { component: Step1Name, title: 'Name' },
  { component: Step2Avatar, title: 'Avatar' },
  { component: Step3HeardFrom, title: 'Source' },
  { component: Step4Interests, title: 'Interests' },
];

const BoardingContent = () => {
  const { currentStep, boardingData } = useBoardingContext();
  const navigate = useNavigate();
  const CurrentStepComponent = steps[currentStep]?.component;

  useEffect(() => {
    // When all steps are completed, navigate to dashboard or home
    if (currentStep >= steps.length) {
      console.log('Boarding completed with data:', boardingData);
      // You can save the data to your backend here
      // For now, navigate to home or dashboard
      navigate('/');
    }
  }, [currentStep, boardingData, navigate]);

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Progress indicator */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <span key={index} className="flex-1 text-center">
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Current step content */}
      <div className="w-full">
        <CurrentStepComponent />
      </div>

      {/* Step counter */}
      <div className="mt-8 text-sm text-muted-foreground">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

const Boarding = () => {
  return (
    <BoardingProvider>
      <BoardingContent />
    </BoardingProvider>
  );
};

export default Boarding;
