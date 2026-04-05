import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  ChevronDown,
  Globe,
  Heart,
  Image as ImageIcon,
  Loader2,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Trash2,
  Video,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../App';
import CommentSection from '../components/CommentSection';

import story1 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl1.png';
import story2 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl2.png';
import story3 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl3.png';
import story4 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/card_ppl4.png';
import miniPic from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/mini_pic.png';
import fallbackPostImage from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/timeline_img.png';
import composerAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/txt_img.png';
import react1 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/react_img1.png';
import react2 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/react_img2.png';
import react3 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/react_img3.png';
import react4 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/react_img4.png';
import react5 from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/react_img5.png';

const stories = [
  { id: 'your-story', title: 'Your Story', image: story1, own: true },
  { id: 'ryan-1', title: 'Ryan Roslansky', image: story2, mini: miniPic },
  { id: 'ryan-2', title: 'Ryan Roslansky', image: story3, mini: miniPic },
  { id: 'ryan-3', title: 'Ryan Roslansky', image: story4, mini: miniPic },
];

const reactionIcons = [react1, react2, react3, react4, react5];

export default function FeedPage() {
  const { profile, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postLikes, setPostLikes] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    if (!user) return;

    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsData = snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            ...data,
            isPublic: typeof data.isPublic === 'boolean' ? data.isPublic : !data.isPrivate,
          };
        });
        setPosts(postsData);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      },
    );

    const likesQuery = query(collection(db, 'likes'), where('userId', '==', user.uid));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      const likesMap = {};
      snapshot.docs.forEach((item) => {
        const like = item.data();
        likesMap[like.targetId] = true;
      });
      setPostLikes(likesMap);
    });

    return () => {
      unsubscribePosts();
      unsubscribeLikes();
    };
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !profile) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: profile.uid,
        authorName: `${profile.firstName} ${profile.lastName}`.trim(),
        authorPhoto: profile.photoURL || '',
        content,
        imageUrl: imageUrl.trim() || null,
        isPublic: !isPrivate,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
      });

      setContent('');
      setImageUrl('');
      setIsPrivate(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) return;

    const likeId = `${user.uid}_${postId}`;
    const likeRef = doc(db, 'likes', likeId);
    const postRef = doc(db, 'posts', postId);

    try {
      if (postLikes[postId]) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likeCount: increment(-1) });
      } else {
        await setDoc(likeRef, {
          userId: user.uid,
          targetId: postId,
          createdAt: serverTimestamp(),
        });
        await updateDoc(postRef, { likeCount: increment(1) });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'likes');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${postId}`);
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
                    <img
                      src={story.mini}
                      alt=""
                      className="absolute left-4 top-4 h-10 w-10 rounded-full border-2 border-white object-cover"
                    />
                  )}
                  <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">
                    {story.title}
                  </p>
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
              placeholder="Write something ..."
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

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  <Video size={18} />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivate((current) => !current)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    isPrivate
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isPrivate ? <Lock size={18} /> : <Globe size={18} />}
                  <span>{isPrivate ? 'Private' : 'Public'}</span>
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
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt={post.authorName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold text-sky-700">
                        {post.authorName?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{post.authorName}</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</span>
                      <span>&bull;</span>
                      {post.isPublic === false ? <Lock size={10} /> : <Globe size={10} />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.authorId === user?.uid && (
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
                <h4 className="mb-4 text-lg font-semibold text-slate-900">-Healthy Tracking App</h4>
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{post.content}</p>
              </div>

              <div className="overflow-hidden">
                <img
                  src={post.imageUrl || fallbackPostImage}
                  alt="Post content"
                  className="max-h-[540px] w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (post.imageUrl) {
                      e.currentTarget.src = fallbackPostImage;
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-3 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    {reactionIcons.map((icon, index) => (
                      <img
                        key={`${post.id}-reaction-${index}`}
                        src={icon}
                        alt=""
                        className="-ml-2 h-8 w-8 rounded-full border-2 border-white first:ml-0"
                      />
                    ))}
                    <span className="ml-3 text-sm font-medium text-slate-600">
                      {post.likeCount || 0}+
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      className="transition hover:text-slate-700"
                    >
                      {post.commentCount || 0} Comment
                    </button>
                    <span>&bull;</span>
                    <span>0 Share</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      postLikes[post.id]
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart size={18} fill={postLikes[post.id] ? 'currentColor' : 'none'} />
                    <span>Haha</span>
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

              {expandedComments[post.id] && <CommentSection postId={post.id} />}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

