import React from 'react';

const GameSelector = ({ games, selectedGame, onSelectGame, onUploadClick }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getUploadStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'Ready' },
      uploading: { color: 'bg-yellow-100 text-yellow-800', text: 'Uploading...' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      pending: { color: 'bg-gray-100 text-gray-800', text: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Games Library</h3>
        <button
          onClick={onUploadClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Upload Game</span>
        </button>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No games uploaded yet</h4>
          <p className="text-gray-600 mb-4">Upload your first game video to start analyzing plays</p>
          <button
            onClick={onUploadClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Your First Game
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedGame?.id === game.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">
                      vs {game.opponent}
                    </h4>
                    {getUploadStatusBadge(game.uploadStatus)}
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>📅 {formatDate(game.date)}</span>
                      {game.gameType && (
                        <span>🏀 {game.gameType}</span>
                      )}
                      {game.score && (
                        <span>📊 {game.score}</span>
                      )}
                    </div>
                  </div>

                  {game.duration && (
                    <div className="mt-1 text-xs text-gray-500">
                      Duration: {Math.floor(game.duration / 60)}:{(game.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}

                  {game.notes && (
                    <div className="mt-2 text-xs text-gray-600">
                      {game.notes.length > 100 ? `${game.notes.substring(0, 100)}...` : game.notes}
                    </div>
                  )}
                </div>

                {game.thumbnailUrl && (
                  <div className="ml-4 flex-shrink-0">
                    <img
                      src={game.thumbnailUrl}
                      alt={`${game.opponent} game thumbnail`}
                      className="w-16 h-12 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSelector; 