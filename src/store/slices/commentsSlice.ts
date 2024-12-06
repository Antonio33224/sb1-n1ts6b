import { StateCreator } from 'zustand';
import { collection, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Comment, User } from '../../types';

export interface CommentsSlice {
  comments: Comment[];
  initComments: () => void;
  addComment: (comment: Omit<Comment, 'id' | 'likes' | 'likedBy' | 'createdAt'>) => Promise<void>;
  likeComment: (commentId: string, currentUser: User) => Promise<void>;
}

export const createCommentsSlice: StateCreator<CommentsSlice> = (set, get) => ({
  comments: [],
  initComments: () => {
    const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as Comment[];
      set({ comments });
    });
  },
  addComment: async (comment) => {
    await addDoc(collection(db, 'comments'), {
      ...comment,
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
    });
  },
  likeComment: async (commentId, currentUser) => {
    const comment = get().comments.find((c) => c.id === commentId);
    if (comment && !comment.likedBy.includes(currentUser.id)) {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        likes: comment.likes + 1,
        likedBy: [...comment.likedBy, currentUser.id],
      });
    }
  },
});