import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { useBoardingContext } from '../context/boarding-context';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const step2Schema = z.object({
  avatar: z.string().optional(),
});

type Step2FormData = z.infer<typeof step2Schema>;

const avatarOptions = [
  '😀', '😎', '🤓', '🥳', '🤩', '😇',
  '🦸', '🧙', '🧑‍💻', '👨‍🚀', '🧑‍🎨', '🧑‍🔬',
];

export const Step2Avatar = () => {
  const { boardingData, updateBoardingData, nextStep, prevStep } = useBoardingContext();
  const [selectedAvatar, setSelectedAvatar] = useState(boardingData.avatar || '');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    setValue,
    handleSubmit,
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
    setCustomAvatar(null);
    setValue('avatar', avatar);
    updateBoardingData({ avatar, avatarFile: undefined });
  };

  const handleCustomAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomAvatar(result);
        setSelectedAvatar('');
        setValue('avatar', 'custom');
        updateBoardingData({ avatar: 'custom', avatarFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomClick = () => {
    fileInputRef.current?.click();
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
            <button
              type="button"
              onClick={handleCustomClick}
              className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 flex flex-col items-center justify-center ${
                customAvatar
                  ? 'border-primary bg-primary/10 scale-110'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {customAvatar ? (
                <img src={customAvatar} alt="Custom" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">Custom</span>
                </>
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCustomAvatarUpload}
            className="hidden"
          />
        </div>

        {(selectedAvatar || customAvatar) && (
          <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
            {customAvatar ? (
              <img src={customAvatar} alt="Custom avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <span className="text-5xl">{selectedAvatar}</span>
            )}
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
