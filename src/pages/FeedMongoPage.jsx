import React, { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  Globe,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Trash2,
  Video,
} from 'lucide-react';
import { useAuth } from '../App';
import { apiFetch } from '../lib/api';
import { getSocket } from '../lib/socket';
import CommentSection from '../components/MongoCommentSection';

import story1 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl1.png';
import story2 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl2.png';
import story3 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl3.png';
import story4 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl4.png';
import miniPic from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/mini_pic.png';
import fallbackPostImage from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/timeline_img.png';
import composerAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/txt_img.png';

const stories = [
  { id: 'your-story', title: 'Your Story', image: story1, own: true },
  { id: 'ryan-1', title: 'Ryan Roslansky', image: story2, mini: miniPic },
  { id: 'ryan-2', title: 'Ryan Roslansky', image: story3, mini: miniPic },
  { id: 'ryan-3', title: 'Ryan Roslansky', image: story4, mini: miniPic },
];

const reactionOptions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

function totalReactions(reactionCounts = {}) {
  return Object.values(reactionCounts).reduce((sum, value) => sum + (value || 0), 0);
}

function toPostMedia(imageUrl) {
  if (!imageUrl.trim()) {
    return [];
  }

  return [{ type: 'image', url: imageUrl.trim() }];
}

export default function FeedMongoPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      try {
        const response = await apiFetch('/feed?limit=10');
        if (!cancelled) {
          setPosts(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load feed.');
        }
      }
    }

    loadFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('feed:join');

    const onPostCreated = (post) => {
      setPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
    };

    const onPostDeleted = ({ id }) => {
      setPosts((current) => current.filter((item) => item.id !== id));
    };

    const onPostReactionUpdated = ({ targetId, reactionCounts, viewerReaction }) => {
      setPosts((current) =>
        current.map((post) =>
          post.id === targetId
            ? {
                ...post,
                reactionCounts,
                viewerReaction,
                hasReacted: Boolean(viewerReaction),
              }
            : post,
        ),
      );
    };

    const onCommentCreated = (comment) => {
      setPosts((current) =>
        current.map((post) =>
          post.id === comment.postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post,
        ),
      );
    };

    const onCommentDeleted = ({ postId }) => {
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, commentCount: Math.max(0, (post.commentCount || 0) - 1) }
            : post,
        ),
      );
    };

    socket.on('post:created', onPostCreated);
    socket.on('post:deleted', onPostDeleted);
    socket.on('post:reactionUpdated', onPostReactionUpdated);
    socket.on('comment:created', onCommentCreated);
    socket.on('comment:deleted', onCommentDeleted);

    return () => {
      socket.off('post:created', onPostCreated);
      socket.off('post:deleted', onPostDeleted);
      socket.off('post:reactionUpdated', onPostReactionUpdated);
      socket.off('comment:created', onCommentCreated);
      socket.off('comment:deleted', onCommentDeleted);
    };
  }, []);

  const sortedReactionLabel = useMemo(() => reactionOptions[2], []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/posts', {
        method: 'POST',
        body: {
          content: content.trim(),
          media: toPostMedia(imageUrl),
        },
      });
      setPosts((current) => [response.post, ...current.filter((item) => item.id !== response.post.id)]);
      setContent('');
      setImageUrl('');
    } catch (err) {
      setError(err?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactPost = async (post) => {
    const nextReaction = post.viewerReaction ? null : sortedReactionLabel;

    try {
      if (nextReaction) {
        const response = await apiFetch('/reactions', {
          method: 'PUT',
          body: {
            targetType: 'post',
            targetId: post.id,
            reactionType: nextReaction,
          },
        });
        setPosts((current) =>
          current.map((item) =>
            item.id === post.id
              ? { ...item, reactionCounts: response.reactionCounts, viewerReaction: response.viewerReaction, hasReacted: true }
              : item,
          ),
        );
      } else {
        const response = await apiFetch('/reactions', {
          method: 'DELETE',
          body: {
            targetType: 'post',
            targetId: post.id,
          },
        });
        setPosts((current) =>
          current.map((item) =>
            item.id === post.id
              ? { ...item, reactionCounts: response.reactionCounts, viewerReaction: null, hasReacted: false }
              : item,
          ),
        );
      }
    } catch (err) {
      setError(err?.message || 'Failed to update reaction.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err?.message || 'Failed to delete post.');
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((current) => ({
      ...current,
      [postId]: !current[postId],
    }));
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_25px_60px_rgba(148,163,184,0.16)] sm:p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stories.map((story) => (
            <div key={story.id} className="relative overflow-hidden rounded-[24px]">
              <img src={story.image} alt={story.title} className="h-44 w-full object-cover sm:h-52" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/75" />
              {story.own ? (
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <button className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-white shadow-lg">
                    <Plus size={18} />
                  </button>
                  <p className="text-sm font-semibold text-white">{story.title}</p>
                </div>
              ) : (
                <>
                  {story.mini && (
                    <img src={story.mini} alt="" className="absolute left-4 top-4 h-10 w-10 rounded-full border-2 border-white object-cover" />
                  )}
                  <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">{story.title}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_25px_60px_rgba(148,163,184,0.16)] sm:p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-sky-100">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <img src={composerAvatar} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <textarea
              className="min-h-[120px] w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder={`What's on your mind, ${profile?.firstName || 'friend'}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <div className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <ImageIcon size={18} />
                    <span>Photo</span>
                  </button>
                  <div className="invisible absolute left-0 top-full z-10 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                </div>

                <button type="button" className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                  <Video size={18} />
                  <span>Video</span>
                </button>

                <button type="button" className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                  <Globe size={18} />
                  <span>Public</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={loading || !content.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                <span>Post</span>
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_25px_60px_rgba(148,163,184,0.16)]"
            >
              <div className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-sky-100">
                    {post.author?.avatarUrl ? (
                      <img src={post.author.avatarUrl} alt={post.author.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold text-sky-700">
                        {post.author?.fullName?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{post.author?.fullName}</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}</span>
                      <span>&bull;</span>
                      <Globe size={10} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.author?.id === profile?.id && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              <div className="px-5 pb-4 sm:px-6">
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{post.content}</p>
              </div>

              {(post.media?.[0]?.url || fallbackPostImage) && (
                <div className="overflow-hidden">
                  <img
                    src={post.media?.[0]?.url || fallbackPostImage}
                    alt="Post content"
                    className="max-h-[540px] w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = fallbackPostImage;
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                      {totalReactions(post.reactionCounts)} reacts
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <button type="button" onClick={() => toggleComments(post.id)} className="transition hover:text-slate-700">
                      {post.commentCount || 0} Comment
                    </button>
                    <span>&bull;</span>
                    <span>{post.shareCount || 0} Share</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleReactPost(post)}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      post.hasReacted ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart size={18} fill={post.hasReacted ? 'currentColor' : 'none'} />
                    <span>{post.viewerReaction || 'React'}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <MessageCircle size={18} />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {expandedComments[post.id] && (
                <CommentSection
                  postId={post.id}
                  onCommentCountChange={(delta) => {
                    setPosts((current) =>
                      current.map((item) =>
                        item.id === post.id
                          ? { ...item, commentCount: Math.max(0, (item.commentCount || 0) + delta) }
                          : item,
                      ),
                    );
                  }}
                />
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
