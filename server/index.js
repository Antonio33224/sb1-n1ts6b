import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory data storage
const data = {
  profiles: [],
  messages: [],
  comments: []
};

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join', ({ userId }) => {
    socket.userId = userId;
    socket.emit('dataSync', data);
  });

  socket.on('requestData', () => {
    socket.emit('dataSync', data);
  });

  socket.on('newProfile', (profile) => {
    data.profiles.push(profile);
    io.emit('newProfile', profile);
  });

  socket.on('newMessage', (message) => {
    data.messages.push(message);
    io.emit('newMessage', message);
  });

  socket.on('newComment', (comment) => {
    data.comments.push(comment);
    io.emit('newComment', comment);
  });

  socket.on('likeProfile', ({ profileId, userId }) => {
    const profile = data.profiles.find(p => p.id === profileId);
    if (profile && !profile.likedBy.includes(userId)) {
      profile.likes += 1;
      profile.likedBy.push(userId);
      io.emit('profileLiked', { profileId, userId });
    }
  });

  socket.on('likeMessage', ({ messageId, userId }) => {
    const message = data.messages.find(m => m.id === messageId);
    if (message && !message.likedBy.includes(userId)) {
      message.likes += 1;
      message.likedBy.push(userId);
      io.emit('messageLiked', { messageId, userId });
    }
  });

  socket.on('likeComment', ({ commentId, userId }) => {
    const comment = data.comments.find(c => c.id === commentId);
    if (comment && !comment.likedBy.includes(userId)) {
      comment.likes += 1;
      comment.likedBy.push(userId);
      io.emit('commentLiked', { commentId, userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});