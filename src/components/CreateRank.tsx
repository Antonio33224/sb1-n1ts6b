import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CreateRank: React.FC = () => {
  const [rankName, setRankName] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { profiles, addRank } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rankName.trim() || selectedProfiles.length === 0) return;

    await addRank({
      name: rankName.trim(),
      profileIds: selectedProfiles,
      createdAt: new Date(),
    });

    setRankName('');
    setSelectedProfiles([]);
  };

  const toggleProfile = (profileId: string) => {
    setSelectedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Criar Novo Ranking
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rankName" className="block text-sm font-medium text-gray-700">
            Nome do Ranking
          </label>
          <input
            type="text"
            id="rankName"
            value={rankName}
            onChange={(e) => setRankName(e.target.value)}
            placeholder="Ex: Top Perfis da Semana"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione os Perfis
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {profiles.map((profile) => (
              <label
                key={profile.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProfiles.includes(profile.id)}
                  onChange={() => toggleProfile(profile.id)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{profile.username}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!rankName.trim() || selectedProfiles.length === 0}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Criar Ranking
        </button>
      </form>
    </div>
  );
};