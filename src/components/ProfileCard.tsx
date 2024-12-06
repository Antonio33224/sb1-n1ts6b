import React from 'react';
import { MessageCircle, Heart, User, CheckCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Profile } from '../types';
import { useStore } from '../store/useStore';

interface ProfileCardProps {
  profile: Profile;
  messageCount: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, messageCount }) => {
  const { likeProfile, followProfile, currentUser } = useStore();
  
  const likedBy = profile.likedBy || [];
  const followers = profile.followers || [];
  const isLiked = currentUser && likedBy.includes(currentUser.id);
  const isFollowing = currentUser && followers.includes(currentUser.id);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser && profile.id) {
      await likeProfile(profile.id, currentUser);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser && profile.id) {
      await followProfile(profile.id, currentUser);
    }
  };

  return (
    <div className="group">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <Link to={`/profile/${profile.id}`}>
          <div className="flex items-center space-x-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-200">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors truncate">
                  {profile.username}
                  {profile.userNumber > 0 && (
                    <span className="text-sm text-gray-500">#{profile.userNumber}</span>
                  )}
                </h3>
                {profile.isVerified && (
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-600 text-sm md:text-base line-clamp-2">{profile.bio}</p>
            </div>
          </div>
        </Link>
        
        <div className="mt-4 md:mt-6 flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link to={`/profile/${profile.id}`} className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{messageCount}</span>
            </Link>
            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{profile.likes}</span>
            </button>
            <button
              onClick={handleFollow}
              disabled={isFollowing}
              className={`flex items-center space-x-1 transition-colors ${
                isFollowing ? 'text-green-500' : 'hover:text-green-500'
              }`}
            >
              <UserPlus className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
              <span className="text-sm">{followers.length}</span>
            </button>
          </div>
          
          <span className="text-xs md:text-sm">
            {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};