import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment, 
  setDoc, 
  deleteDoc,
  where
} from 'firebase/firestore';
import { useAuth } from '../App';
import { 
  Image as ImageIcon, 
  Send, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Trash2, 
  Globe, 
  Lock,
  Loader2,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from '../components/CommentSection';
import { motion, AnimatePresence } from 'motion/react';

export default function Feed() {
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

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });

    // Fetch user's likes
    const likesQuery = query(collection(db, 'likes'), where('userId', '==', user.uid));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      const likesMap = {};
      snapshot.docs.forEach(doc => {
        const like = doc.data();
        likesMap[like.targetId] = true;
      });
      setPostLikes(likesMap);
    });

    return () => {
      unsubscribe();
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
        authorName: `${profile.firstName} ${profile.lastName}`,
        authorPhoto: profile.photoURL || '',
        content,
        imageUrl: imageUrl.trim() || null,
        isPrivate,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0
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
          createdAt: serverTimestamp()
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
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100 overflow-hidden shrink-0">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile?.firstName?.[0]
            )}
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[100px]"
              placeholder={`What's on your mind, ${profile?.firstName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                <ImageIcon size={18} className="text-green-500" />
                <span className="text-sm font-bold">Photo</span>
              </button>
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl p-3 shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-10">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${isPrivate ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              {isPrivate ? <Lock size={18} /> : <Globe size={18} />}
              <span className="text-sm font-bold">{isPrivate ? 'Private' : 'Public'}</span>
            </button>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={loading || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 overflow-hidden">
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" />
                    ) : (
                      post.authorName?.[0]
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none mb-1">{post.authorName}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</span>
                      <span>•</span>
                      {post.isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.authorId === user?.uid && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="border-y border-gray-50 bg-gray-50 flex justify-center max-h-[500px] overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt="Post content" 
                    className="max-w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="bg-blue-500 rounded-full p-1">
                      <Heart size={10} fill="white" className="text-white" />
                    </div>
                    <span className="font-medium">{post.likeCount || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{post.commentCount || 0} comments</span>
                  <span>•</span>
                  <span className="font-medium">0 shares</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-2 py-1 flex items-center justify-between border-t border-gray-50">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${postLikes[post.id] ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart size={20} fill={postLikes[post.id] ? 'currentColor' : 'none'} />
                  <span className="font-bold">Like</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <MessageCircle size={20} />
                  <span className="font-bold">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                  <Share2 size={20} />
                  <span className="font-bold">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <CommentSection postId={post.id} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
