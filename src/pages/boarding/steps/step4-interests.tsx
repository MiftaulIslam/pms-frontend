import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useBoardingContext } from '../boarding-context';
import { Button } from '@/components/ui/button';

const step4Schema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

type Step4FormData = z.infer<typeof step4Schema>;

const interestOptions = [
  { value: 'project-management', label: '📊 Project Management', icon: '📊' },
  { value: 'team-collaboration', label: '👥 Team Collaboration', icon: '👥' },
  { value: 'task-tracking', label: '✅ Task Tracking', icon: '✅' },
  { value: 'agile-scrum', label: '🔄 Agile & Scrum', icon: '🔄' },
  { value: 'reporting', label: '📈 Reporting & Analytics', icon: '📈' },
  { value: 'time-tracking', label: '⏱️ Time Tracking', icon: '⏱️' },
  { value: 'resource-planning', label: '🗓️ Resource Planning', icon: '🗓️' },
  { value: 'automation', label: '⚡ Automation', icon: '⚡' },
];

export const Step4Interests = () => {
  const { boardingData, updateBoardingData, nextStep, prevStep } = useBoardingContext();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    boardingData.interests || []
  );

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      interests: boardingData.interests || [],
    },
  });

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
  };

  const onSubmit = (data: Step4FormData) => {
    updateBoardingData(data);
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">What are you interested in?</h2>
        <p className="text-muted-foreground">Select all that apply</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleInterest(option.value)}
                className={`relative p-4 border-2 rounded-lg text-left transition-all hover:scale-105 ${
                  selectedInterests.includes(option.value)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="flex-1 font-medium">{option.label.replace(/^.+?\s/, '')}</span>
                  {selectedInterests.includes(option.value) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="text-sm text-red-500 text-center">{errors.interests.message}</p>
          )}
        </div>

        {selectedInterests.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => {
                const option = interestOptions.find((o) => o.value === interest);
                return (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                  >
                    {option?.icon} {option?.label.replace(/^.+?\s/, '')}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Complete
          </Button>
        </div>
      </form>
    </div>
  );
};
