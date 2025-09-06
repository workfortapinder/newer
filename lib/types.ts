import type { LucideIcon } from 'lucide-react';

export type IconName = 'Book' | 'Dumbbell' | 'Feather' | 'Leaf' | 'Repeat' | 'Coffee';

export interface Task {
  id: string;
  text: string;
  completions: number;
  target: number;
  icon: IconName;
}

export interface Mission {
  id: string;
  title: string;
  reward: string;
  rewardImage: string;
  timeFrame: 'daily' | 'weekly' | 'monthly';
  tasks: Task[];
  motivation: string;
  motivationMedia?: MediaItem[];
}

export interface ClientTask {
    id: string;
    text: string;
    completions: number;
    target: number;
    icon: LucideIcon;
}

export type MediaKind = 'image' | 'video' | 'audio';

export interface MediaItem {
  kind: MediaKind;
  url: string;
  name?: string;
  mimeType?: string;
}
