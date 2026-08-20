import { api } from '@/lib/api';
import { Comment } from '@/types';

export interface CreateCommentInput {
  content: string;
  taskId: string;
}

export async function createComment(data: CreateCommentInput): Promise<Comment> {
  const response = await api.post('/comments', data);
  return response.data;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}
