import { StateCreator } from 'zustand';
import { collection, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Message, User } from '../../types';

export interface MessagesSlice {
  messages: Message[];
  initMessages: () => () => void;
  addMessage: (message: Omit<Message, 'id' | 'likes' | 'likedBy' | 'createdAt'>) => Promise<void>;
  likeMessage: (messageId: string, currentUser: User) => Promise<void>;
}

export const createMessagesSlice: StateCreator<MessagesSlice> = (set, get) => ({
  messages: [],
  initMessages: () => {
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(messagesQuery, 
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          likedBy: doc.data().likedBy || [],
          likes: doc.data().likes || 0,
        })) as Message[];
        set({ messages });
      },
      (error) => {
        console.error("Messages listener error:", error);
        setTimeout(() => get().initMessages(), 5000);
      }
    );

    return unsubscribe;
  },
  addMessage: async (message) => {
    try {
      await addDoc(collection(db, 'messages'), {
        ...message,
        likes: 0,
        likedBy: [],
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  },
  likeMessage: async (messageId, currentUser) => {
    try {
      const message = get().messages.find((m) => m.id === messageId);
      if (!message) {
        throw new Error('Message not found');
      }
      
      if (message.likedBy?.includes(currentUser.id)) {
        return; // Already liked
      }

      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        likes: (message.likes || 0) + 1,
        likedBy: [...(message.likedBy || []), currentUser.id],
      });
    } catch (error) {
      console.error("Error liking message:", error);
      throw error;
    }
  },
});