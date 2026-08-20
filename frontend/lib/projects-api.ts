import { api } from '@/lib/api';
import { Project } from '@/types';

export interface CreateProjectInput {
  name: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  leadId?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  leadId?: string;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await api.get('/projects');
  return response.data;
}

export async function fetchProjectById(id: string): Promise<Project> {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const response = await api.post('/projects', data);
  return response.data;
}

export async function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
