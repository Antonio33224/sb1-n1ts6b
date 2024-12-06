import React from 'react';
import { BarChart3, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PollsList: React.FC = () => {
  const { polls, votePoll, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await votePoll(pollId, optionIndex);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getTotalVotes = (poll: typeof polls[0]) => {
    return poll.options.reduce((sum, option) => sum + option.votes, 0);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar enquetes..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {filteredPolls.map((poll) => {
        const totalVotes = getTotalVotes(poll);
        
        return (
          <div key={poll.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-800">{poll.question}</h3>
            </div>

            <div className="space-y-4">
              {poll.options.map((option, index) => {
                const percentage = totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0;

                return (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => handleVote(poll.id, index)}
                      disabled={!currentUser}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-gray-500">
                          {option.votes} votos ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              Total de votos: {totalVotes}
            </div>
          </div>
        );
      })}
    </div>
  );
};