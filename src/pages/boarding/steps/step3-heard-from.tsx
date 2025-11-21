import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBoardingContext } from '../boarding-context';
import { Button } from '@/components/ui/button';

const step3Schema = z.object({
  heardFrom: z.string().min(1, 'Please select an option'),
});

type Step3FormData = z.infer<typeof step3Schema>;

const heardFromOptions = [
  { value: 'search', label: 'Search Engine (Google, Bing, etc.)' },
  { value: 'social', label: 'Social Media' },
  { value: 'friend', label: 'Friend or Colleague' },
  { value: 'blog', label: 'Blog or Article' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

export const Step3HeardFrom = () => {
  const { boardingData, updateBoardingData, nextStep, prevStep } = useBoardingContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      heardFrom: boardingData.heardFrom || '',
    },
  });

  const onSubmit = (data: Step3FormData) => {
    updateBoardingData(data);
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">How did you hear about us?</h2>
        <p className="text-muted-foreground">Help us understand how you found us</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          {heardFromOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="radio"
                value={option.value}
                {...register('heardFrom')}
                className="w-4 h-4 text-primary"
              />
              <span className="flex-1">{option.label}</span>
            </label>
          ))}
          {errors.heardFrom && (
            <p className="text-sm text-red-500">{errors.heardFrom.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
