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
import { Heart, Loader2, Send } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../App';

import fallbackCommentAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/comment_img.png';
import commentPreviewAvatar from '../../Selection Task for Full Stack Engineer at Appifylab/assets/images/txt_img.png';

export default function CommentSection({ postId }) {
  const { profile, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `comments/${postId}`);
    });

    // Fetch comment likes
    const likesQuery = query(collection(db, 'likes'), where('userId', '==', user.uid));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      const likesMap = {};
      snapshot.docs.forEach(doc => {
        const like = doc.data();
        likesMap[like.targetId] = true;
      });
      setCommentLikes(likesMap);
    });

    return () => {
      unsubscribe();
      unsubscribeLikes();
    };
  }, [postId, user]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim() || !profile) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        authorId: profile.uid,
        authorName: `${profile.firstName} ${profile.lastName}`,
        authorPhoto: profile.photoURL || '',
        content,
        createdAt: serverTimestamp(),
        likeCount: 0
      });
      
      // Increment post comment count
      await updateDoc(doc(db, 'posts', postId), {
        commentCount: increment(1)
      });
      
      setContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;
    const likeId = `${user.uid}_${commentId}`;
    const likeRef = doc(db, 'likes', likeId);
    const commentRef = doc(db, 'comments', commentId);

    try {
      if (commentLikes[commentId]) {
        await deleteDoc(likeRef);
        await updateDoc(commentRef, { likeCount: increment(-1) });
      } else {
        await setDoc(likeRef, {
          userId: user.uid,
          targetId: commentId,
          createdAt: serverTimestamp()
        });
        await updateDoc(commentRef, { likeCount: increment(1) });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'likes');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      await updateDoc(doc(db, 'posts', postId), {
        commentCount: increment(-1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `comments/${commentId}`);
    }
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-6">
      <div className="mb-4">
        {comments.length > 0 && (
          <button type="button" className="text-sm font-medium text-slate-500 transition hover:text-slate-700">
            View {comments.length} previous comments
          </button>
        )}
      </div>

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
                {comment.authorPhoto ? (
                  <img src={comment.authorPhoto} alt={comment.authorName} className="h-full w-full object-cover" />
                ) : (
                  <img src={commentPreviewAvatar} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h5 className="text-sm font-semibold text-slate-900">{comment.authorName}</h5>
                    <span className="text-[11px] text-slate-400">
                      {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{comment.content}</p>
                </div>

                <div className="ml-2 mt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`transition-colors ${commentLikes[comment.id] ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Like
                  </button>
                  <button className="transition-colors text-slate-500 hover:text-slate-700">
                    Reply
                  </button>
                  <button className="transition-colors text-slate-500 hover:text-slate-700">
                    Share
                  </button>
                  <span className="text-slate-400">
                    {(comment.likeCount || 0) > 0 ? `${comment.likeCount || 0} reacts` : '.21m'}
                  </span>
                  {comment.authorId === user?.uid && (
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
