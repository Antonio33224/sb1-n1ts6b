import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trophy, BarChart3, TrendingUp, Heart, Star, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const HomePage: React.FC = () => {
  const { messages, profiles } = useStore();
  
  const getTrendingContent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMessages = messages.filter(m => 
      m.createdAt.getTime() >= today.getTime()
    );
    
    const mostLikedMessages = [...todayMessages]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    const mostLikedProfiles = [...profiles]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
      
    return { mostLikedMessages, mostLikedProfiles };
  };
  
  const { mostLikedMessages, mostLikedProfiles } = getTrendingContent();

  const features = [
    {
      icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
      title: "Mensagens Anônimas",
      description: "Envie mensagens de forma anônima para qualquer perfil. Suas mensagens são totalmente privadas e seguras.",
      link: "/profiles",
      color: "from-blue-500 to-blue-600",
      tooltip: "Crie um perfil ou envie mensagens anônimas para outros usuários"
    },
    {
      icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      title: "Rankings Personalizados",
      description: "Crie rankings únicos e vote nos seus perfis favoritos. Organize e compartilhe suas listas.",
      link: "/ranks",
      color: "from-yellow-500 to-yellow-600",
      tooltip: "Crie rankings temáticos e organize perfis em listas personalizadas"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-500" />,
      title: "Enquetes Interativas",
      description: "Participe de enquetes da comunidade ou crie as suas próprias para descobrir opiniões.",
      link: "/polls",
      color: "from-purple-500 to-purple-600",
      tooltip: "Crie enquetes e vote em tópicos interessantes da comunidade"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="space-y-12">
      <motion.div 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Bem-vindo ao AnonTalk
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Uma plataforma interativa para compartilhar pensamentos, criar rankings e participar de enquetes
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={feature.link}
              className="feature-card group"
              data-tooltip={feature.tooltip}
            >
              <div className="relative z-10">
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="card space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Principais do Dia
            </h2>
          </motion.div>
          <div className="flex items-center gap-1 text-sm text-gray-500" data-tooltip="Conteúdo atualizado diariamente">
            <Info className="w-4 h-4" />
            <span>Atualizado hoje</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            className="space-y-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Perfis Mais Curtidos
            </h3>
            <div className="space-y-3">
              {mostLikedProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    to={`/profile/${profile.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-gray-500 bg-gray-200 rounded-full">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {profile.username}
                        </span>
                        {profile.isVerified && (
                          <span className="text-blue-500 flex-shrink-0" data-tooltip="Perfil Verificado">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{profile.bio}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Heart className="w-4 h-4" />
                      {profile.likes}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Mensagens Mais Curtidas
            </h3>
            <div className="space-y-4">
              {mostLikedMessages.map((message, index) => {
                const profile = profiles.find(p => p.id === message.profileId);
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link
                      to={`/profile/${message.profileId}`}
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-gray-800 mb-2 line-clamp-2">{message.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Para: {profile?.username}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {message.likes}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};