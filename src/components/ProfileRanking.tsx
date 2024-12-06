import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Profile } from '../types';

interface ProfileRankingProps {
  profiles: Profile[];
}

export const ProfileRanking: React.FC<ProfileRankingProps> = ({ profiles }) => {
  const sortedProfiles = [...profiles].sort((a, b) => b.likes - a.likes);
  const topProfiles = sortedProfiles.slice(0, 3);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Perfis
      </h2>
      
      <div className="space-y-4">
        {topProfiles.map((profile, index) => (
          <Link
            key={profile.id}
            to={`/profile/${profile.id}`}
            className="block group"
          >
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate group-hover:text-blue-500">
                    {profile.username}
                  </span>
                  {profile.isVerified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{profile.bio}</p>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-sm font-medium">{profile.likes}</span>
                <span className="text-xs">likes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};