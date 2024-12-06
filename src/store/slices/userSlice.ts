import { StateCreator } from 'zustand';
import { User } from '../../types';

export interface UserSlice {
  currentUser: User | null;
  initUser: () => void;
  incrementProfileCount: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  currentUser: null,
  initUser: () => {
    set((state) => {
      if (!state.currentUser) {
        return {
          currentUser: {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            profilesCreated: 0,
          },
        };
      }
      return state;
    });
  },
  incrementProfileCount: () => {
    set((state) => ({
      currentUser: state.currentUser ? {
        ...state.currentUser,
        profilesCreated: state.currentUser.profilesCreated + 1,
      } : null,
    }));
  },
});