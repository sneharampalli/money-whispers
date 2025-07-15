import { createContext } from 'react';

export type Thread = {
  thread_id: string;
  title: string;
  description: string;
}

export interface WhisperContextProps {
  threads: Thread[];
  fetchThreads: () => void;
}

export const WhisperContext = createContext<WhisperContextProps | undefined>(undefined);