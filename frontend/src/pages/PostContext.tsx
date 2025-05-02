import React, { createContext, useContext } from 'react';

export type Thread = {
  thread_id: string;
  title: string;
  description: string;
}

export interface PostContextProps {
  threads: Thread[];
  fetchThreads: () => void;
}

export const PostContext = createContext<PostContextProps | undefined>(undefined);