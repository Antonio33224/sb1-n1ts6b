import { StateCreator } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  enableNetwork,
  disableNetwork,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Profile, User } from '../../types';

export interface ProfilesSlice {
  profiles: Profile[];
  initProfiles: () => () => void; // Return cleanup function
  addProfile: (profile: Omit<Profile, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'followers' | 'isVerified' | 'userNumber'>) => Promise<void>;
  likeProfile: (profileId: string, currentUser: User) => Promise<void>;
  followProfile: (profileId: string, currentUser: User) => Promise<void>;
  setOnline: (online: boolean) => Promise<void>;
}

export const createProfilesSlice: StateCreator<ProfilesSlice> = (set, get) => ({
  profiles: [],
  initProfiles: () => {
    const profilesQuery = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(profilesQuery, 
      (snapshot) => {
        const profiles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          likedBy: doc.data().likedBy || [],
          followers: doc.data().followers || [],
          likes: doc.data().likes || 0,
          userNumber: doc.data().userNumber || 0,
          isVerified: doc.data().isVerified || false,
        })) as Profile[];
        set({ profiles });
      },
      (error) => {
        console.error("Profiles listener error:", error);
        setTimeout(() => get().initProfiles(), 5000);
      }
    );

    return unsubscribe;
  },
  addProfile: async (profile) => {
    try {
      // Check if username already exists
      const usernameQuery = query(
        collection(db, 'profiles'),
        where('username', '==', profile.username)
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      
      const isFirstWithUsername = usernameSnapshot.empty;
      const userNumber = isFirstWithUsername ? 0 : usernameSnapshot.size;

      await addDoc(collection(db, 'profiles'), {
        ...profile,
        likes: 0,
        likedBy: [],
        followers: [],
        isVerified: isFirstWithUsername,
        userNumber,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding profile:", error);
      throw error;
    }
  },
  likeProfile: async (profileId, currentUser) => {
    try {
      const profile = get().profiles.find((p) => p.id === profileId);
      if (profile && !profile.likedBy.includes(currentUser.id)) {
        const profileRef = doc(db, 'profiles', profileId);
        await updateDoc(profileRef, {
          likes: (profile.likes || 0) + 1,
          likedBy: [...(profile.likedBy || []), currentUser.id],
        });
      }
    } catch (error) {
      console.error("Error liking profile:", error);
      throw error;
    }
  },
  followProfile: async (profileId, currentUser) => {
    try {
      const profile = get().profiles.find((p) => p.id === profileId);
      if (profile && !profile.followers.includes(currentUser.id)) {
        const profileRef = doc(db, 'profiles', profileId);
        await updateDoc(profileRef, {
          followers: [...(profile.followers || []), currentUser.id],
        });
      }
    } catch (error) {
      console.error("Error following profile:", error);
      throw error;
    }
  },
  setOnline: async (online: boolean) => {
    try {
      if (online) {
        await enableNetwork(db);
      } else {
        await disableNetwork(db);
      }
    } catch (error) {
      console.error("Error setting online status:", error);
    }
  },
});