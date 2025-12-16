import * as React from 'react';
import { PlaygroundContext } from './playground-context';

export const usePlayground = () => {
  const context = React.useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};

