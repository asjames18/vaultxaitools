'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

interface QuickVoteProps {
  toolId: string;
}

interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

export default function QuickVote({ toolId }: QuickVoteProps) {
  const [voteData, setVoteData] = useState<VoteData>({
    upvotes: 0,
    downvotes: 0,
    userVote: null
  });
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const fetchVotes = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch all votes for this tool
      const { data: votes, error: votesError } = await supabase
        .from('tool_votes')
        .select('vote_type, user_id')
        .eq('tool_id', toolId);

      if (votesError) throw votesError;

      // Count votes
      const upvotes = votes?.filter((v: any) => v.vote_type === 'up').length || 0;
      const downvotes = votes?.filter((v: any) => v.vote_type === 'down').length || 0;
      
      // Find user's vote
      const userVote = user ? votes?.find((v: any) => v.user_id === user.id)?.vote_type || null : null;

      setVoteData({
        upvotes,
        downvotes,
        userVote: userVote as 'up' | 'down' | null
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load votes');
      console.error('Error fetching votes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('You must be logged in to vote');
      return;
    }

    setIsVoting(true);
    setError('');

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('tool_votes')
        .select('id, vote_type')
        .eq('tool_id', toolId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking the same vote type
          await supabase
            .from('tool_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote if clicking different vote type
          await supabase
            .from('tool_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Insert new vote
        await supabase
          .from('tool_votes')
          .insert([{
            tool_id: toolId,
            user_id: user.id,
            vote_type: voteType
          }]);
      }

      // Refresh vote counts
      await fetchVotes();

    } catch (err: any) {
      setError(err.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [toolId]);

  if (loading) {
    return (
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-6 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-6 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {error && (
        <div className="text-xs text-red-600 mb-2">{error}</div>
      )}
      
      {/* Upvote */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleVote('up')}
          disabled={isVoting}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
            voteData.userVote === 'up'
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700">
          {voteData.upvotes}
        </span>
      </div>

      {/* Downvote */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleVote('down')}
          disabled={isVoting}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
            voteData.userVote === 'down'
              ? 'bg-red-100 border-red-300 text-red-700'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700">
          {voteData.downvotes}
        </span>
      </div>

      {/* Net Score */}
      <div className="text-xs text-gray-500">
        Score: {voteData.upvotes - voteData.downvotes}
      </div>
    </div>
  );
} 