import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { MessageCircle, Menu, X, Trophy, BarChart3, Sparkles } from 'lucide-react';
import { CreateProfile } from './components/CreateProfile';
import { ProfileCard } from './components/ProfileCard';
import { ProfilePage } from './components/ProfilePage';
import { SearchBar } from './components/SearchBar';
import { ProfileRanking } from './components/ProfileRanking';
import { CreateRank } from './components/CreateRank';
import { CreatePoll } from './components/CreatePoll';
import { RanksList } from './components/RanksList';
import { PollsList } from './components/PollsList';
import { HomePage } from './components/HomePage';
import { useStore } from './store/useStore';

function App() {
  const { 
    profiles, 
    messages, 
    initUser, 
    initProfiles, 
    initMessages, 
    initComments,
    initRanks,
    initPolls,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initUser();
    initProfiles();
    initMessages();
    initComments();
    initRanks();
    initPolls();
  }, [initUser, initProfiles, initMessages, initComments, initRanks, initPolls]);

  const filteredProfiles = profiles.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Sparkles className="w-8 h-8 text-blue-500" />
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  AnonTalk
                </span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/profiles"
                  className="nav-link"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Perfis</span>
                </Link>
                <Link
                  to="/ranks"
                  className="nav-link"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Rankings</span>
                </Link>
                <Link
                  to="/polls"
                  className="nav-link"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Enquetes</span>
                </Link>
                <div className="w-64">
                  <SearchBar onSearch={setSearchQuery} />
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden px-4 pt-2 pb-3 space-y-1">
              <SearchBar onSearch={setSearchQuery} />
              <Link
                to="/profiles"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Perfis</span>
              </Link>
              <Link
                to="/ranks"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="w-5 h-5" />
                <span>Rankings</span>
              </Link>
              <Link
                to="/polls"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Enquetes</span>
              </Link>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/profiles"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <div className="mb-8">
                      <ProfileRanking profiles={profiles} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                      Todos os Perfis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProfiles.map((profile) => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          messageCount={
                            messages.filter((m) => m.profileId === profile.id).length
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="order-first lg:order-last">
                    <div className="sticky top-24">
                      <CreateProfile />
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/profile/:profileId" element={<ProfilePage />} />
            <Route
              path="/ranks"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Rankings</h2>
                    <RanksList />
                  </div>
                  <div>
                    <CreateRank />
                  </div>
                </div>
              }
            />
            <Route
              path="/polls"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Enquetes</h2>
                    <PollsList />
                  </div>
                  <div>
                    <CreatePoll />
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;