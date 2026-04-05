import { Reaction } from '../models/Reaction.js';

function baseAuthor(author) {
  return {
    id: author._id.toString(),
    firstName: author.firstName,
    lastName: author.lastName,
    fullName: `${author.firstName} ${author.lastName}`.trim(),
    avatarUrl: author.avatarUrl,
  };
}

export async function attachViewerReactions(items, targetType, userId) {
  if (!userId || items.length === 0) {
    return items.map((item) => ({ ...item, viewerReaction: null, hasReacted: false }));
  }

  const reactions = await Reaction.find({
    userId,
    targetType,
    targetId: { $in: items.map((item) => item.id) },
  }).lean();

  const reactionMap = new Map(reactions.map((reaction) => [reaction.targetId.toString(), reaction.reactionType]));

  return items.map((item) => {
    const viewerReaction = reactionMap.get(item.id) || null;
    return {
      ...item,
      viewerReaction,
      hasReacted: Boolean(viewerReaction),
    };
  });
}

export function serializePost(post) {
  return {
    id: post._id.toString(),
    content: post.content,
    media: post.media || [],
    visibility: post.visibility,
    reactionCounts: post.reactionCounts,
    commentCount: post.commentCount,
    shareCount: post.shareCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: baseAuthor(post.authorId),
  };
}

export function serializeComment(comment) {
  return {
    id: comment._id.toString(),
    postId: comment.postId.toString(),
    parentCommentId: comment.parentCommentId ? comment.parentCommentId.toString() : null,
    content: comment.content,
    reactionCounts: comment.reactionCounts,
    replyCount: comment.replyCount,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: baseAuthor(comment.authorId),
  };
}
