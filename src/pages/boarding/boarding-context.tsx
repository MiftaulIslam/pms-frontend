import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface BoardingData {
  name: string;
  avatar: string;
  heardFrom: string;
  interests: string[];
}

interface BoardingContextType {
  currentStep: number;
  boardingData: Partial<BoardingData>;
  setCurrentStep: (step: number) => void;
  updateBoardingData: (data: Partial<BoardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBoarding: () => void;
}

const BoardingContext = createContext<BoardingContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useBoardingContext = () => {
  const context = useContext(BoardingContext);
  if (!context) {
    throw new Error('useBoardingContext must be used within BoardingProvider');
  }
  return context;
};

interface BoardingProviderProps {
  children: ReactNode;
}

export const BoardingProvider = ({ children }: BoardingProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [boardingData, setBoardingData] = useState<Partial<BoardingData>>({});

  const updateBoardingData = (data: Partial<BoardingData>) => {
    setBoardingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const resetBoarding = () => {
    setCurrentStep(0);
    setBoardingData({});
  };

  return (
    <BoardingContext.Provider
      value={{
        currentStep,
        boardingData,
        setCurrentStep,
        updateBoardingData,
        nextStep,
        prevStep,
        resetBoarding,
      }}
    >
      {children}
    </BoardingContext.Provider>
  );
};
