export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on-hold' | 'review' | 'backlog';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'no-priority';

export interface User {
  id: string;
  email: string | null;
  fullName: string;
  username: string | null;
  title: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  theme: ThemeMode;
  colorMode: ColorMode;
  createdAt?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  priority: PriorityLevel;
  dueDate?: string | null;
  workspaceId: string;
  leadId?: string | null;
  lead?: User | null;
  _count?: {
    tasks: number;
  };
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate?: string | null;
  startDate?: string | null;
  userId?: string | null;
  user?: User | null;
  creatorId?: string | null;
  creator?: User | null;
  projectId?: string | null;
  project?: Project | null;
  parentId?: string | null;
  subtasks?: Task[];
  labels?: Label[];
  comments?: Comment[];
  _count?: {
    subtasks: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
