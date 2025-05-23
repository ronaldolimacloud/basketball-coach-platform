import React from 'react';

const TeamDashboard = ({ 
  selectedTeam, 
  players, 
  games, 
  markers, 
  onSwitchTeam,
  onUploadClick,
  onManagePlayersClick,
  onViewAnalyticsClick 
}) => {
  const calculateTeamStats = () => {
    const totalGames = games.length;
    const completedGames = games.filter(game => game.uploadStatus === 'completed').length;
    const totalPlayers = players.length;
    const totalMarkers = markers.length;
    
    // Calculate win/loss record
    const gamesWithScores = games.filter(game => game.ourScore !== null && game.opponentScore !== null);
    const wins = gamesWithScores.filter(game => game.ourScore > game.opponentScore).length;
    const losses = gamesWithScores.filter(game => game.ourScore < game.opponentScore).length;
    
    return {
      totalGames,
      completedGames,
      totalPlayers,
      totalMarkers,
      wins,
      losses,
      winPercentage: gamesWithScores.length > 0 ? (wins / gamesWithScores.length * 100).toFixed(1) : 0
    };
  };

  const stats = calculateTeamStats();

  if (!selectedTeam) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Team Selected</h3>
        <p className="text-gray-600 mb-4">Select a team or create your first team to get started</p>
        <button
          onClick={onSwitchTeam}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select Team
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                selectedTeam.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedTeam.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {selectedTeam.ageGroup && <span>🏀 {selectedTeam.ageGroup}</span>}
              {selectedTeam.season && <span>📅 {selectedTeam.season}</span>}
              <span>👥 {stats.totalPlayers} players</span>
              <span>🎮 {stats.totalGames} games</span>
            </div>
            
            {selectedTeam.description && (
              <p className="text-gray-700 mt-2">{selectedTeam.description}</p>
            )}
          </div>
          
          <button
            onClick={onSwitchTeam}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Switch Team
          </button>
        </div>
      </div>

      {/* Team Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Games Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Games</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
              <p className="text-sm text-gray-500">{stats.completedGames} with video</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Win/Loss Record */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Record</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wins}-{stats.losses}</p>
              <p className="text-sm text-gray-500">{stats.winPercentage}% win rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Players</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</p>
              <p className="text-sm text-gray-500">Active roster</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Analysis Markers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Analysis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMarkers}</p>
              <p className="text-sm text-gray-500">Markers created</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Upload Game</p>
              <p className="text-sm text-gray-600">Add new game video</p>
            </div>
          </button>

          <button
            onClick={onManagePlayersClick}
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
          >
            <div className="p-2 bg-purple-500 text-white rounded-lg group-hover:bg-purple-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Players</p>
              <p className="text-sm text-gray-600">Add or edit roster</p>
            </div>
          </button>

          <button
            onClick={onViewAnalyticsClick}
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <div className="p-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Team performance insights</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group">
            <div className="p-2 bg-yellow-500 text-white rounded-lg group-hover:bg-yellow-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Export Report</p>
              <p className="text-sm text-gray-600">Generate team report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {games.slice(0, 3).map((game) => (
            <div key={game.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                game.uploadStatus === 'completed' ? 'bg-green-500' : 
                game.uploadStatus === 'uploading' ? 'bg-yellow-500' : 
                'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium">vs {game.opponent}</p>
                <p className="text-sm text-gray-600">
                  {new Date(game.date).toLocaleDateString()} • {game.gameType}
                  {game.score && ` • ${game.score}`}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                game.uploadStatus === 'completed' ? 'bg-green-100 text-green-800' :
                game.uploadStatus === 'uploading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {game.uploadStatus === 'completed' ? 'Ready' : 
                 game.uploadStatus === 'uploading' ? 'Uploading' : 'Pending'}
              </span>
            </div>
          ))}
          
          {games.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No games uploaded yet for this team</p>
              <button
                onClick={onUploadClick}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Upload your first game →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard; 