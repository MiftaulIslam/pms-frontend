import { BoardingProvider, useBoardingContext } from './context/boarding-context';
import { Step1Name } from './steps/step1-name';
import { Step2Avatar } from './steps/step2-avatar';
import { Step3HeardFrom } from './steps/step3-heard-from';
import { Step4Interests } from './steps/step4-interests';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/pages/auth/context/use-auth';
import { completeBoarding } from './api/boarding-api';
import { Button } from '@/components/ui/button';
import { emojiToImageFile } from './utils/emoji-to-image';

const steps = [
  { component: Step1Name, title: 'Name' },
  { component: Step2Avatar, title: 'Avatar' },
  { component: Step3HeardFrom, title: 'Source' },
  { component: Step4Interests, title: 'Interests' },
];

const BoardingContent = () => {
  const { user, loading, fetchCurrentUser } = useAuth();
  console.log({ userName: user?.name, loading });
  const { currentStep, boardingData } = useBoardingContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const CurrentStepComponent = steps[currentStep]?.component;

  const completeBoardingProcess = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', boardingData.name || '');
      formData.append('heardAboutUs', boardingData.heardFrom || '');
      
      // Add interests as array
      if (boardingData.interests) {
        boardingData.interests.forEach((interest) => {
          formData.append('interestIn', interest);
        });
      }
      
      // Add avatar file if it exists (custom upload)
      if (boardingData.avatarFile) {
        formData.append('avatar', boardingData.avatarFile);
      } else if (boardingData.avatar && boardingData.avatar !== 'custom') {
        // For emoji avatars, convert to image file first
        try {
          const emojiImageFile = await emojiToImageFile(boardingData.avatar);
          formData.append('avatar', emojiImageFile);
        } catch (error) {
          console.error('Failed to convert emoji to image:', error);
          // Fallback: send as string if conversion fails
          formData.append('avatar', boardingData.avatar);
        }
      }
      
      await completeBoarding(formData);
      await fetchCurrentUser(); // Refresh user data to get updated avatar
      navigate('/dashboard');
    } catch (error) {
      console.error('Boarding completion failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [boardingData, navigate, fetchCurrentUser]);

  const skipBoarding = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // Redirect if user is already onboarded
    if (user?.onboarded) {
      navigate('/dashboard');
      return;
    }
    
    // When all steps are completed, call the API to complete boarding
    if (currentStep >= steps.length) {
      console.log('Boarding completed with data:', boardingData);
      completeBoardingProcess();
    }
  }, [currentStep, boardingData, completeBoardingProcess, user, navigate]);

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

      {/* Skip for now button */}
      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={skipBoarding}
          disabled={isSubmitting}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </Button>
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
