export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color?: string;
  font?: string;
  fontSize?: number;
  reminder?: number | null;
  isHidden?: boolean;
}

export type Theme = 'light' | 'dark' | 'amoled';

export type View = 'notes' | 'calculator' | 'sticky';

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: string;
}
