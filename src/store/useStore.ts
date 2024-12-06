import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSlice, createUserSlice } from './slices/userSlice';
import { ProfilesSlice, createProfilesSlice } from './slices/profilesSlice';
import { MessagesSlice, createMessagesSlice } from './slices/messagesSlice';
import { CommentsSlice, createCommentsSlice } from './slices/commentsSlice';
import { RanksSlice, createRanksSlice } from './slices/ranksSlice';
import { PollsSlice, createPollsSlice } from './slices/pollsSlice';

type StoreState = UserSlice & ProfilesSlice & MessagesSlice & CommentsSlice & RanksSlice & PollsSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createProfilesSlice(...a),
      ...createMessagesSlice(...a),
      ...createCommentsSlice(...a),
      ...createRanksSlice(...a),
      ...createPollsSlice(...a),
    }),
    {
      name: 'anonymous-messages-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);