export interface Profile {
  id: string;
  username: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  followers: string[];
  isVerified: boolean;
  userNumber: number;
  creatorId: string;
}

export interface Message {
  id: string;
  profileId: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  messageId: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  createdAt: Date;
  profilesCreated: number;
}

export interface Rank {
  id: string;
  name: string;
  profileIds: string[];
  createdAt: Date;
  creatorId: string;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  creatorId: string;
}