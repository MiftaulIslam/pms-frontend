
export interface BoardingData {
  name: string;
  avatar: string;
  avatarFile?: File;
  heardFrom: string;
  interests: string[];
}

export interface BoardingContextType {
  currentStep: number;
  boardingData: Partial<BoardingData>;
  setCurrentStep: (step: number) => void;
  updateBoardingData: (data: Partial<BoardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBoarding: () => void;
  completeBoarding: () => Promise<void>;
  skipBoarding: () => void;
}