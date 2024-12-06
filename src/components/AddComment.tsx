import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface AddCommentProps {
  messageId: string;
}

export const AddComment: React.FC<AddCommentProps> = ({ messageId }) => {
  const [content, setContent] = useState('');
  const addComment = useStore((state) => state.addComment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment({
      messageId,
      content: content.trim(),
    });

    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Comentar
        </button>
      </div>
    </form>
  );
};