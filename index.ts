export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'completed' | 'on-hold';
export type Category = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'career';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  careerGoals?: string[];
  preferredWorkingHours?: {
    start: string;
    end: string;
  };
  skillDomain?: string;
  subscriptionTier: 'free' | 'pro' | 'premium';
  xp: number;
  level: number;
  createdAt: any;
  lastActive: any;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  category: Category;
  dueDate?: any;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  tags: string[];
  isAiGenerated?: boolean;
  parentId?: string; // for subtasks
  createdAt: any;
  updatedAt: any;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: any;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  streak: number;
  lastChecked: any;
  frequency: 'daily' | 'weekly';
  targetDays: number[]; // 0-6
  createdAt: any;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetDate: any;
  milestones: Milestone[];
  progress: number;
  hoursPerWeek: number;
  createdAt: any;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: any;
}
