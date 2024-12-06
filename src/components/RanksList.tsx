import React from 'react';
import { Trophy, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Profile } from '../types';

export const RanksList: React.FC = () => {
  const { ranks, profiles } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredRanks = ranks.filter(rank =>
    rank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProfilesForRank = (profileIds: string[]): Profile[] => {
    return profileIds
      .map(id => profiles.find(p => p.id === id))
      .filter((p): p is Profile => p !== undefined);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar rankings..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {filteredRanks.map((rank) => (
        <div key={rank.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800">{rank.name}</h3>
          </div>

          <div className="space-y-4">
            {getProfilesForRank(rank.profileIds).map((profile, index) => (
              <div
                key={profile.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-gray-500">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {profile.username}
                    </span>
                    {profile.isVerified && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{profile.bio}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {profile.likes} likes
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};