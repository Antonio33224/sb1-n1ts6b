import React, { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import type { Message, Comment } from '../types';
import { useStore } from '../store/useStore';
import { AddComment } from './AddComment';

interface MessageCardProps {
  message: Message;
  comments: Comment[];
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, comments }) => {
  const [showComments, setShowComments] = useState(false);
  const { likeMessage, likeComment, currentUser } = useStore();
  
  // Ensure properties exist with default values
  const messageLikedBy = message.likedBy || [];
  const isMessageLiked = currentUser && messageLikedBy.includes(currentUser.id);

  const handleLikeMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser && message.id && !isMessageLiked) {
      try {
        await likeMessage(message.id, currentUser);
      } catch (error) {
        console.error('Error liking message:', error);
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (currentUser) {
      try {
        await likeComment(commentId, currentUser);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 transform transition-all duration-300 hover:shadow-xl">
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">{message.content}</p>
      
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLikeMessage}
            disabled={isMessageLiked}
            className={`flex items-center space-x-2 transition-colors ${
              isMessageLiked
                ? 'text-red-500'
                : 'hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isMessageLiked ? 'fill-current' : ''}`} />
            <span>{message.likes || 0}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>
        </div>
        
        <span className="text-sm">
          {new Date(message.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {showComments && (
        <div className="mt-6 space-y-4">
          <AddComment messageId={message.id} />
          
          <div className="space-y-3">
            {comments.map((comment) => {
              const commentLikedBy = comment.likedBy || [];
              const isCommentLiked = currentUser && commentLikedBy.includes(currentUser.id);
              
              return (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={isCommentLiked}
                      className={`flex items-center space-x-1 transition-colors ${
                        isCommentLiked
                          ? 'text-red-500'
                          : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isCommentLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};