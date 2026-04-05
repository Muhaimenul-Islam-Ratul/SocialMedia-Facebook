import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Send } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useAuth } from '../App';

import fallbackCommentAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/comment_img.png';
import commentPreviewAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/txt_img.png';

function totalReactions(reactionCounts = {}) {
  return Object.values(reactionCounts).reduce((sum, value) => sum + (value || 0), 0);
}

export default function MongoCommentSection({ postId, onCommentCountChange }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        const response = await apiFetch(`/posts/${postId}/comments?limit=20`);
        if (!cancelled) {
          setComments(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load comments.');
        }
      }
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('post:join', postId);

    const onCreated = (comment) => {
      if (comment.postId !== postId) {
        return;
      }
      setComments((current) => [...current.filter((item) => item.id !== comment.id), comment]);
    };

    const onDeleted = ({ id, postId: deletedPostId }) => {
      if (deletedPostId !== postId) {
        return;
      }
      setComments((current) => current.filter((item) => item.id !== id));
    };

    const onReactionUpdated = ({ targetId, reactionCounts, viewerReaction }) => {
      setComments((current) =>
        current.map((comment) =>
          comment.id === targetId
            ? {
                ...comment,
                reactionCounts,
                viewerReaction,
                hasReacted: Boolean(viewerReaction),
              }
            : comment,
        ),
      );
    };

    socket.on('comment:created', onCreated);
    socket.on('comment:deleted', onDeleted);
    socket.on('comment:reactionUpdated', onReactionUpdated);

    return () => {
      socket.emit('post:leave', postId);
      socket.off('comment:created', onCreated);
      socket.off('comment:deleted', onDeleted);
      socket.off('comment:reactionUpdated', onReactionUpdated);
    };
  }, [postId]);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: {
          content: content.trim(),
        },
      });
      setComments((current) => [...current.filter((item) => item.id !== response.comment.id), response.comment]);
      setContent('');
    } catch (err) {
      setError(err?.message || 'Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactComment = async (comment) => {
    try {
      if (comment.hasReacted) {
        const response = await apiFetch('/reactions', {
          method: 'DELETE',
          body: {
            targetType: 'comment',
            targetId: comment.id,
          },
        });
        setComments((current) =>
          current.map((item) =>
            item.id === comment.id
              ? { ...item, reactionCounts: response.reactionCounts, viewerReaction: null, hasReacted: false }
              : item,
          ),
        );
      } else {
        const response = await apiFetch('/reactions', {
          method: 'PUT',
          body: {
            targetType: 'comment',
            targetId: comment.id,
            reactionType: 'like',
          },
        });
        setComments((current) =>
          current.map((item) =>
            item.id === comment.id
              ? { ...item, reactionCounts: response.reactionCounts, viewerReaction: 'like', hasReacted: true }
              : item,
          ),
        );
      }
    } catch (err) {
      setError(err?.message || 'Failed to update comment reaction.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
      setComments((current) => current.filter((item) => item.id !== commentId));
    } catch (err) {
      setError(err?.message || 'Failed to delete comment.');
    }
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-6">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-5 space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
                {comment.author?.avatarUrl ? (
                  <img src={comment.author.avatarUrl} alt={comment.author.fullName} className="h-full w-full object-cover" />
                ) : (
                  <img src={commentPreviewAvatar} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h5 className="text-sm font-semibold text-slate-900">{comment.author?.fullName}</h5>
                    <span className="text-[11px] text-slate-400">
                      {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
                </div>

                <div className="ml-2 mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <button
                    onClick={() => handleReactComment(comment)}
                    className={`transition-colors ${comment.hasReacted ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {comment.hasReacted ? 'Unlike' : 'Like'}
                  </button>
                  <span className="text-slate-400">
                    {totalReactions(comment.reactionCounts) > 0 ? `${totalReactions(comment.reactionCounts)} reacts` : 'No reacts yet'}
                  </span>
                  {comment.author?.id === profile?.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="transition-colors text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleAddComment} className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <img src={fallbackCommentAvatar} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="relative flex-1">
          <textarea
            className="min-h-[52px] w-full resize-none rounded-full border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            placeholder="Write a comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-sky-600 transition hover:bg-sky-50 disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}
