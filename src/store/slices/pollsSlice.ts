import { StateCreator } from 'zustand';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Poll } from '../../types';

export interface PollsSlice {
  polls: Poll[];
  initPolls: () => void;
  addPoll: (poll: Omit<Poll, 'id' | 'creatorId'>) => Promise<void>;
  votePoll: (pollId: string, optionIndex: number) => Promise<void>;
}

export const createPollsSlice: StateCreator<PollsSlice> = (set, get) => ({
  polls: [],
  initPolls: () => {
    const pollsQuery = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    onSnapshot(pollsQuery, (snapshot) => {
      const polls = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as Poll[];
      set({ polls });
    });
  },
  addPoll: async (poll) => {
    const { currentUser } = get() as any;
    if (!currentUser) throw new Error('User not authenticated');

    await addDoc(collection(db, 'polls'), {
      ...poll,
      creatorId: currentUser.id,
    });
  },
  votePoll: async (pollId: string, optionIndex: number) => {
    const poll = get().polls.find(p => p.id === pollId);
    if (!poll) return;

    const newOptions = [...poll.options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      votes: newOptions[optionIndex].votes + 1,
    };

    const pollRef = doc(db, 'polls', pollId);
    await updateDoc(pollRef, { options: newOptions });
  },
});