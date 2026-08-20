import { api } from '@/lib/api';
import { Task } from '@/types';

export interface FetchTasksParams {
  status?: string;
  search?: string;
  projectId?: string;
  priority?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  startDate?: string;
  projectId?: string;
  parentId?: string;
  userId?: string;
  labelIds?: string[];
}

export async function fetchTasks(params?: FetchTasksParams): Promise<Task[]> {
  const response = await api.get('/tasks', { params });
  return response.data;
}

export async function fetchTaskById(id: string): Promise<Task> {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await api.post('/tasks', data);
  return response.data;
}

export async function updateTask(id: string, data: Partial<CreateTaskInput>): Promise<Task> {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
