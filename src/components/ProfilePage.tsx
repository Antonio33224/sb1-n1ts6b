import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ProfileCard } from './ProfileCard';
import { CreateMessage } from './CreateMessage';
import { MessageCard } from './MessageCard';

export const ProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { profiles, messages, comments } = useStore();
  
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return <div>Perfil não encontrado</div>;
  
  const profileMessages = messages.filter((m) => m.profileId === profileId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Mensagens para {profile.username}
        </h2>
        
        <CreateMessage profile={profile} />
        
        {profileMessages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            comments={comments.filter((c) => c.messageId === message.id)}
          />
        ))}
      </div>
      
      <div>
        <ProfileCard
          profile={profile}
          messageCount={profileMessages.length}
        />
      </div>
    </div>
  );
};