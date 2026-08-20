'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { createComment, deleteComment } from '@/lib/comments-api';
import { useQueryClient } from '@tanstack/react-query';
import { Paperclip, Send, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface CommentSectionProps {
  taskId: string;
  comments?: Comment[];
}

export function CommentSection({ taskId, comments = [] }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({ content: content.trim(), taskId });
      toast.success('Comment posted');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);

      if (diffMinutes < 1) return 'just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden shadow-xs space-y-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
        <h3 className="text-xs font-bold text-gray-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>Subtasks / Activity</span>
        </h3>
        <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Comment List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400 dark:text-neutral-500">
            No comments yet. Start the conversation below.
          </div>
        ) : (
          comments.map((comment) => {
            const authorName = comment.user?.fullName || 'User';
            const avatarInitial = authorName.charAt(0).toUpperCase();

            return (
              <div key={comment.id} className="flex gap-3 group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  {comment.user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.user.avatarUrl}
                      alt={authorName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    avatarInitial
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 bg-gray-50 dark:bg-neutral-850/60 p-3 rounded-xl border border-gray-100 dark:border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {authorName}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-neutral-500">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative pt-2">
        <div className="flex items-end gap-2 p-2 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 dark:bg-neutral-950/40 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-neutral-900 transition-all">
          <textarea
            rows={2}
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 bg-transparent border-0 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-hidden resize-none"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="p-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              title="Send Comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
