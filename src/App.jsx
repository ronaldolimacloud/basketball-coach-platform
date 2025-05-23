import React, { useState, useRef, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { 
  VideoUploadModal, 
  GameSelector, 
  TeamSelector, 
  Sidebar, 
  MobileHeader, 
  EnhancedTeamDashboard 
} from './components';

const client = generateClient();

// Video Player Component - Enhanced for Mobile
const VideoPlayer = ({ game, markers, onAddMarker, selectedPlayer }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = (e) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const videoWidth = rect.width;
    const clickPercentage = clickX / videoWidth;
    const newTimestamp = Math.floor(clickPercentage * videoRef.current.duration);
    
    onAddMarker(newTimestamp, selectedPlayer);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToMarker = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Game vs {game.opponent}
        </h2>
        <span className="text-sm text-gray-500">{game.date}</span>
      </div>
      
      <div className="relative bg-black rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={game.videoUrl}
          className="w-full h-48 sm:h-64 lg:h-96 object-cover"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-xs lg:text-sm">
          👆 Tap to add marker
        </div>
      </div>

      {/* Enhanced Timeline for Mobile */}
      <div className="relative bg-gray-200 h-10 lg:h-12 rounded-lg mb-4 overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 opacity-30 transition-all duration-100"
          style={{ width: videoRef.current ? `${(currentTime / videoRef.current.duration) * 100}%` : '0%' }}
        />
        
        {markers.map(marker => (
          <div
            key={marker.id}
            className={`absolute w-3 h-3 lg:w-4 lg:h-4 rounded-full cursor-pointer top-1/2 transform -translate-y-1/2 ${
              marker.type === 'positive' ? 'bg-green-500 shadow-lg shadow-green-200' : 
              marker.type === 'improvement' ? 'bg-yellow-500 shadow-lg shadow-yellow-200' :
              'bg-blue-500 shadow-lg shadow-blue-200'
            } hover:scale-125 transition-transform`}
            style={{ left: `${(marker.timestamp / game.duration) * 100}%` }}
            onClick={() => jumpToMarker(marker.timestamp)}
            title={`${formatTime(marker.timestamp)} - ${marker.description}`}
          />
        ))}
        
        <div className="absolute bottom-1 left-2 text-xs text-gray-600">{formatTime(currentTime)}</div>
        <div className="absolute bottom-1 right-2 text-xs text-gray-600">{formatTime(game.duration)}</div>
      </div>

      {/* Enhanced Controls for Mobile */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={togglePlay}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm lg:text-base"
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button 
          onClick={() => onAddMarker(currentTime, selectedPlayer)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm lg:text-base"
          disabled={!selectedPlayer}
        >
          🏷️ Add Marker
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm lg:text-base">
          ✂️ Create Clip
        </button>
      </div>
      
      {!selectedPlayer && (
        <p className="text-xs text-gray-500 text-center mt-2">Select a player to add markers</p>
      )}
    </div>
  );
};

// Enhanced Player List Component - Mobile First
const PlayerList = ({ players, selectedPlayer, onSelectPlayer, onAddPlayer, selectedTeam }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
      <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-900">
        {selectedTeam ? `${selectedTeam.name} Roster` : 'Team Roster'}
      </h3>
      
      <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedPlayer?.id === player.id 
                ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">#{player.number} {player.name}</div>
                <div className="text-sm text-gray-600">{player.position}</div>
                {player.grade && <div className="text-xs text-gray-500">{player.grade}</div>}
              </div>
              {selectedPlayer?.id === player.id && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAddPlayer}
        disabled={!selectedTeam}
        className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        + Add Player {selectedTeam ? `to ${selectedTeam.name}` : ''}
      </button>
      
      {!selectedTeam && (
        <p className="text-xs text-gray-500 mt-2 text-center">Select a team to manage players</p>
      )}
    </div>
  );
};

// Enhanced Markers List Component - Mobile First
const MarkersList = ({ markers, players, onDeleteMarker }) => {
  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? `#${player.number} ${player.name}` : 'Unknown Player';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMarkerIcon = (type) => {
    switch(type) {
      case 'positive': return '👍';
      case 'improvement': return '⚠️';
      default: return '📝';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">Game Markers</h3>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {markers.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-64 lg:max-h-96 overflow-y-auto">
        {markers.map(marker => (
          <div
            key={marker.id}
            className={`p-4 rounded-lg border-l-4 ${
              marker.type === 'positive' ? 'border-green-500 bg-green-50' : 
              marker.type === 'improvement' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getMarkerIcon(marker.type)}</span>
                  <div className="font-semibold text-blue-600">{formatTime(marker.timestamp)}</div>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">{getPlayerName(marker.playerId)}</div>
                <div className="text-sm text-gray-700 mb-2">{marker.description}</div>
                {marker.category && (
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {marker.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      marker.priority === 'high' ? 'bg-red-100 text-red-700' :
                      marker.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {marker.priority}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onDeleteMarker(marker.id)}
                className="text-red-500 hover:text-red-700 text-sm p-2 hover:bg-red-50 rounded transition-colors"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
        
        {markers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">📝</span>
            <p>No markers yet</p>
            <p className="text-xs mt-1">Click on the video timeline to add markers</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component with Mobile-First Layout
const Dashboard = ({ user, signOut }) => {
  // Team Management State
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Team-specific Data State
  const [markers, setMarkers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'analysis', 'players'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load teams and initial data
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        
        // Load user's teams
        const { data: teamsData, errors } = await client.models.Team.list();
        
        // Check for actual errors vs empty results
        if (errors && errors.length > 0) {
          console.error('Error loading teams:', errors);
          alert('Error loading teams from database.');
          return;
        }
        
        setTeams(teamsData || []);
        
        // If teams exist, select the first active one
        if (teamsData?.length > 0) {
          const activeTeam = teamsData.find(team => team.isActive) || teamsData[0];
          setSelectedTeam(activeTeam);
        }
        
      } catch (error) {
        console.error('Error loading teams:', error);
        // Only show error for actual network/auth issues
        if (error.name !== 'UnauthorizedError') {
          alert('Error connecting to database. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  // Load team-specific data when team changes
  useEffect(() => {
    const loadTeamData = async () => {
      if (!selectedTeam?.id) {
        setPlayers([]);
        setGames([]);
        setMarkers([]);
        setSelectedPlayer(null);
        setSelectedGame(null);
        return;
      }

      try {
        // Load team players
        const { data: playersData } = await client.models.Player.list({
          filter: { teamId: { eq: selectedTeam.id } }
        });
        setPlayers(playersData || []);
        
        // Load team games  
        const { data: gamesData } = await client.models.Game.list({
          filter: { teamId: { eq: selectedTeam.id } }
        });
        setGames(gamesData || []);
        
        // Set default selections
        if (playersData?.length > 0) {
          setSelectedPlayer(playersData[0]);
        }
        if (gamesData?.length > 0) {
          const completedGame = gamesData.find(game => game.uploadStatus === 'completed') || gamesData[0];
          setSelectedGame(completedGame);
        }
        
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };

    loadTeamData();
  }, [selectedTeam]);

  // Load markers when game changes
  useEffect(() => {
    const loadMarkers = async () => {
      if (selectedGame?.id && selectedTeam?.id) {
        try {
          const { data: markersData } = await client.models.Marker.list({
            filter: { 
              gameId: { eq: selectedGame.id },
              teamId: { eq: selectedTeam.id }
            }
          });
          setMarkers(markersData || []);
        } catch (error) {
          console.error('Error loading markers:', error);
        }
      } else {
        setMarkers([]);
      }
    };

    loadMarkers();
  }, [selectedGame, selectedTeam]);

  // Team Management Functions
  const handleCreateTeam = async (teamData) => {
    try {
      const { data: newTeam } = await client.models.Team.create({
        ...teamData
      });
      
      setTeams(prev => [...prev, newTeam]);
      setSelectedTeam(newTeam);
      setShowTeamSelector(false);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setShowTeamSelector(false);
    setCurrentView('dashboard');
  };

  // Player Management Functions
  const handleAddPlayer = async () => {
    if (!selectedTeam) {
      alert('Please select a team first!');
      return;
    }

    const name = prompt('Player name:');
    const number = prompt('Jersey number:');
    const position = prompt('Position:');
    const grade = prompt('Grade (optional):');
    
    if (name && number && position) {
      try {
        const { data: newPlayer } = await client.models.Player.create({
          name,
          number: parseInt(number),
          position,
          grade: grade || undefined,
          teamId: selectedTeam.id,
          active: true
        });
        
        if (newPlayer) {
          setPlayers(prev => [...prev, newPlayer]);
        }
        
      } catch (error) {
        console.error('Error creating player:', error);
        alert('Failed to add player to database');
      }
    }
  };

  // Marker Management Functions
  const handleAddMarker = async (timestamp, player) => {
    if (!player) {
      alert('Please select a player first!');
      return;
    }

    if (!selectedGame || !selectedTeam) {
      alert('Please select a game and team first!');
      return;
    }

    const description = prompt(`Add marker for ${player.name} at ${Math.floor(timestamp / 60)}:${Math.floor(timestamp % 60).toString().padStart(2, '0')}:`);
    
    if (description) {
      try {
        const { data: newMarker } = await client.models.Marker.create({
          timestamp: parseFloat(timestamp),
          playerId: player.id,
          gameId: selectedGame.id,
          teamId: selectedTeam.id,
          description,
          type: 'positive',
          category: 'general',
          priority: 'medium'
        });
        
        if (newMarker) {
          setMarkers(prev => [...prev, newMarker]);
        }
        
      } catch (error) {
        console.error('Error creating marker:', error);
        alert('Failed to save marker to database');
      }
    }
  };

  const handleDeleteMarker = async (markerId) => {
    try {
      await client.models.Marker.delete({ id: markerId });
      setMarkers(markers.filter(m => m.id !== markerId));
    } catch (error) {
      console.error('Error deleting marker:', error);
      alert('Failed to delete marker from database');
    }
  };

  // Upload Management Functions
  const handleUploadComplete = async (newGame) => {
    try {
      // Refresh games list to include the new upload
      const { data: gamesData } = await client.models.Game.list({
        filter: { teamId: { eq: selectedTeam.id } }
      });
      setGames(gamesData || []);
      
      // Select the newly uploaded game
      if (newGame) {
        setSelectedGame(newGame);
        setMarkers([]);
      }
      
      console.log('Upload completed for game:', newGame);
    } catch (error) {
      console.error('Error refreshing games after upload:', error);
    }
  };

  // Calculate stats for sidebar
  const stats = {
    totalPlayers: players.length,
    totalGames: games.length,
    totalMarkers: markers.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coaching platform...</p>
          <p className="text-sm text-gray-500 mt-2">Setting up teams and data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Hidden on mobile, overlay on mobile when open */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedTeam={selectedTeam}
        onTeamSelect={() => setShowTeamSelector(true)}
        onUpload={() => setUploadModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <MobileHeader
          user={user}
          signOut={signOut}
          selectedTeam={selectedTeam}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'analysis' && 'Video Analysis'}
                {currentView === 'players' && 'Player Management'}
                {currentView === 'games' && 'Games'}
              </h1>
              {selectedTeam && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTeam.name} • {selectedTeam.ageGroup} • {selectedTeam.season}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.signInDetails?.loginId}</span>
              <button 
                onClick={signOut}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Show Team Selector if no teams or user wants to switch */}
          {(teams.length === 0 || showTeamSelector) && (
            <div className="p-4 lg:p-6">
              <TeamSelector
                teams={teams}
                selectedTeam={selectedTeam}
                onSelectTeam={handleSelectTeam}
                onCreateTeam={handleCreateTeam}
              />
            </div>
          )}

          {/* Main Dashboard Content */}
          {selectedTeam && !showTeamSelector && (
            <>
              {currentView === 'dashboard' && (
                <EnhancedTeamDashboard
                  selectedTeam={selectedTeam}
                  players={players}
                  games={games}
                  markers={markers}
                  onSwitchTeam={() => setShowTeamSelector(true)}
                  onUploadClick={() => setUploadModalOpen(true)}
                  onManagePlayersClick={() => setCurrentView('players')}
                  onViewAnalyticsClick={() => setCurrentView('analysis')}
                />
              )}

              {currentView === 'analysis' && (
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Video Analysis - Takes up most space */}
                    <div className="xl:col-span-3 space-y-6">
                      {selectedGame && selectedGame.uploadStatus === 'completed' && selectedGame.videoUrl ? (
                        <>
                          <VideoPlayer 
                            game={selectedGame}
                            markers={markers}
                            onAddMarker={handleAddMarker}
                            selectedPlayer={selectedPlayer}
                          />
                          
                          {/* Markers List below video */}
                          <MarkersList 
                            markers={markers}
                            players={players}
                            onDeleteMarker={handleDeleteMarker}
                          />
                        </>
                      ) : (
                        /* Game Selector when no video is ready */
                        <GameSelector
                          games={games}
                          selectedGame={selectedGame}
                          onSelectGame={setSelectedGame}
                          onUploadClick={() => setUploadModalOpen(true)}
                        />
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1">
                      <PlayerList 
                        players={players}
                        selectedPlayer={selectedPlayer}
                        onSelectPlayer={setSelectedPlayer}
                        onAddPlayer={handleAddPlayer}
                        selectedTeam={selectedTeam}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'players' && (
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">{selectedTeam.name} Players</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {players.map(player => (
                            <div key={player.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="font-semibold text-gray-900">#{player.number} {player.name}</div>
                              <div className="text-sm text-gray-600">{player.position}</div>
                              {player.grade && <div className="text-xs text-gray-500">{player.grade}</div>}
                              {player.height && <div className="text-xs text-gray-500">Height: {player.height}</div>}
                            </div>
                          ))}
                        </div>
                        
                        {players.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <span className="text-6xl mb-4 block">👥</span>
                            <p className="text-lg mb-2">No players added to {selectedTeam.name} yet</p>
                            <button
                              onClick={handleAddPlayer}
                              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                              Add your first player →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <PlayerList 
                        players={players}
                        selectedPlayer={selectedPlayer}
                        onSelectPlayer={setSelectedPlayer}
                        onAddPlayer={handleAddPlayer}
                        selectedTeam={selectedTeam}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {currentView === 'games' && (
                <div className="p-4 lg:p-6">
                  <GameSelector
                    games={games}
                    selectedGame={selectedGame}
                    onSelectGame={setSelectedGame}
                    onUploadClick={() => setUploadModalOpen(true)}
                  />
                </div>
              )}
            </>
          )}

          {/* Upload Modal */}
          <VideoUploadModal
            isOpen={uploadModalOpen}
            onClose={() => setUploadModalOpen(false)}
            onUploadComplete={handleUploadComplete}
            selectedTeam={selectedTeam}
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Dashboard user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}