import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Profile } from '../types';

interface CreateMessageProps {
  profile: Profile;
}

export const CreateMessage: React.FC<CreateMessageProps> = ({ profile }) => {
  const [content, setContent] = useState('');
  const addMessage = useStore((state) => state.addMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addMessage({
      profileId: profile.id,
      content: content.trim(),
    });

    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Enviar mensagem para {profile.username}
      </h3>
      
      <div className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite sua mensagem anônima..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enviar Mensagem
        </button>
      </div>
    </form>
  );
};