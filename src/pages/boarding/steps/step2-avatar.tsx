import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useBoardingContext } from '../boarding-context';
import { Button } from '@/components/ui/button';

const step2Schema = z.object({
  avatar: z.string().min(1, 'Please select an avatar'),
});

type Step2FormData = z.infer<typeof step2Schema>;

const avatarOptions = [
  '😀', '😎', '🤓', '🥳', '🤩', '😇',
  '🦸', '🧙', '🧑‍💻', '👨‍🚀', '🧑‍🎨', '🧑‍🔬',
];

export const Step2Avatar = () => {
  const { boardingData, updateBoardingData, nextStep, prevStep } = useBoardingContext();
  const [selectedAvatar, setSelectedAvatar] = useState(boardingData.avatar || '');

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      avatar: boardingData.avatar || '',
    },
  });

  const onSubmit = (data: Step2FormData) => {
    updateBoardingData(data);
    nextStep();
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setValue('avatar', avatar);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Avatar</h2>
        <p className="text-muted-foreground">Pick one that represents you</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => handleAvatarSelect(avatar)}
                className={`aspect-square text-4xl rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedAvatar === avatar
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
          {errors.avatar && (
            <p className="text-sm text-red-500 text-center">{errors.avatar.message}</p>
          )}
        </div>

        {selectedAvatar && (
          <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
            <span className="text-5xl">{selectedAvatar}</span>
            <div>
              <p className="font-medium">{boardingData.name}</p>
              <p className="text-sm text-muted-foreground">Your selected avatar</p>
            </div>
          </div>
        )}

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
