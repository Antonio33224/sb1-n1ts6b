import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AlertCircle } from 'lucide-react';

export const CreateProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const { addProfile, currentUser, incrementProfileCount } = useStore();

  const canCreateProfile = currentUser && currentUser.profilesCreated < 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !canCreateProfile) return;
    
    try {
      await addProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        creatorId: currentUser!.id,
      });
      
      incrementProfileCount();
      
      setUsername('');
      setBio('');
      setAvatarUrl('');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar Perfil</h2>
      
      {currentUser && (
        <div className="mb-4 text-sm text-gray-600">
          Perfis criados: {currentUser.profilesCreated}/3
        </div>
      )}
      
      {!canCreateProfile && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-md flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Você atingiu o limite de 3 perfis criados.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nome de usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={!canCreateProfile}
            required
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Biografia
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={!canCreateProfile}
          />
        </div>
        
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
            URL do Avatar (opcional)
          </label>
          <input
            type="url"
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={!canCreateProfile}
          />
        </div>
        
        <button
          type="submit"
          disabled={!canCreateProfile}
          className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canCreateProfile
              ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Criar Perfil
        </button>
      </form>
    </div>
  );
};