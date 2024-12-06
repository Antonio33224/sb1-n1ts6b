import { StateCreator } from 'zustand';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Rank } from '../../types';

export interface RanksSlice {
  ranks: Rank[];
  initRanks: () => void;
  addRank: (rank: Omit<Rank, 'id' | 'creatorId'>) => Promise<void>;
}

export const createRanksSlice: StateCreator<RanksSlice> = (set, get) => ({
  ranks: [],
  initRanks: () => {
    const ranksQuery = query(collection(db, 'ranks'), orderBy('createdAt', 'desc'));
    onSnapshot(ranksQuery, (snapshot) => {
      const ranks = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as Rank[];
      set({ ranks });
    });
  },
  addRank: async (rank) => {
    const { currentUser } = get() as any;
    if (!currentUser) throw new Error('User not authenticated');

    await addDoc(collection(db, 'ranks'), {
      ...rank,
      creatorId: currentUser.id,
    });
  },
});