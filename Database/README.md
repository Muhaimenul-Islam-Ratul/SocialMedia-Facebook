# Database Setup

This project already uses Firebase Authentication and Cloud Firestore.

## Collections

### users
Document id: `{uid}`

Fields:
- `firstName`: string
- `lastName`: string
- `email`: string
- `photoURL`: string
- `createdAt`: timestamp
- `role`: string (optional)

### posts
Document id: auto-generated

Fields:
- `authorId`: string
- `authorName`: string
- `authorPhoto`: string
- `content`: string
- `imageUrl`: string or null
- `isPublic`: boolean
- `createdAt`: timestamp
- `likeCount`: number
- `commentCount`: number

### comments
Document id: auto-generated

Fields:
- `postId`: string
- `authorId`: string
- `authorName`: string
- `authorPhoto`: string
- `content`: string
- `createdAt`: timestamp
- `likeCount`: number

### likes
Document id: `{userId}_{targetId}`

Fields:
- `userId`: string
- `targetId`: string
- `createdAt`: timestamp

## What works after this setup

- users can register and log in
- Google sign-in creates a profile document if missing
- feed posts load dynamically from Firestore
- users can create posts
- users can react to posts and comments
- users can add and delete comments
- users can see public posts from others and their own posts

## Firestore console setup

1. Open Firebase console for project `social-feed-firebase-auth`.
2. Enable Authentication:
   - Email/Password
   - Google
3. Create Cloud Firestore in production or test mode.
4. Deploy the rules from the project root `firestore.rules` file.
5. Add the composite index defined in `Database/firestore.indexes.json`.

## Important note

The feed now uses `isPublic` for post visibility. Older documents that only have `isPrivate` are still displayed in the UI through a compatibility fallback, but new posts should use `isPublic`.
