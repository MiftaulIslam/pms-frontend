import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBoardingContext } from '../context/boarding-context';
import { Button } from '@/components/ui/button';

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
});

type Step1FormData = z.infer<typeof step1Schema>;

export const Step1Name = () => {
  const { boardingData, updateBoardingData, nextStep } = useBoardingContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: boardingData.name || '',
    },
  });

  const onSubmit = (data: Step1FormData) => {
    updateBoardingData(data);
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Welcome! 👋</h2>
        <p className="text-muted-foreground">Let's get to know you better</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            What's your name?
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
};
