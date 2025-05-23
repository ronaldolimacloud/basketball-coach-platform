import React, { useState, useRef, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient();

// Mock Data
const mockPlayers = [
  { id: 1, name: "John Smith", number: 23, position: "Point Guard", markerCount: 15 },
  { id: 2, name: "Mike Johnson", number: 10, position: "Center", markerCount: 8 },
  { id: 3, name: "Alex Brown", number: 7, position: "Forward", markerCount: 12 },
  { id: 4, name: "Chris Davis", number: 15, position: "Guard", markerCount: 6 },
  { id: 5, name: "Ryan Wilson", number: 32, position: "Forward", markerCount: 9 }
];

const mockMarkers = [
  { id: 1, timestamp: 750, playerId: 1, description: "Great steal and fast break", type: "positive" },
  { id: 2, timestamp: 1125, playerId: 2, description: "Perfect 3-pointer from corner", type: "positive" },
  { id: 3, timestamp: 1512, playerId: 3, description: "Missed defensive assignment", type: "improvement" },
  { id: 4, timestamp: 2000, playerId: 1, description: "Excellent court vision on assist", type: "positive" }
];

// Mock Game Data (temporary - will be replaced with real uploads)
const mockGame = {
  id: 1,
  opponent: "Lakers",
  date: "2024-03-15",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
  duration: 2880 // 48 minutes in seconds
};

// Video Player Component
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
    
    // Add marker at clicked position
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Game vs {game.opponent} - {game.date}</h2>
      
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={game.videoUrl}
          className="w-full h-64 md:h-96"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Click overlay hint */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          Click anywhere to add marker
        </div>
      </div>

      {/* Timeline */}
      <div className="relative bg-gray-200 h-12 rounded-lg mb-4 overflow-hidden">
        {/* Progress bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 opacity-30 transition-all duration-100"
          style={{ width: videoRef.current ? `${(currentTime / videoRef.current.duration) * 100}%` : '0%' }}
        />
        
        {/* Markers */}
        {markers.map(marker => (
          <div
            key={marker.id}
            className={`absolute w-3 h-3 rounded-full cursor-pointer top-1/2 transform -translate-y-1/2 ${
              marker.type === 'positive' ? 'bg-green-500' : 'bg-yellow-500'
            } hover:scale-125 transition-transform`}
            style={{ left: `${(marker.timestamp / game.duration) * 100}%` }}
            onClick={() => jumpToMarker(marker.timestamp)}
            title={`${formatTime(marker.timestamp)} - ${marker.description}`}
          />
        ))}
        
        {/* Time labels */}
        <div className="absolute bottom-1 left-2 text-xs text-gray-600">{formatTime(currentTime)}</div>
        <div className="absolute bottom-1 right-2 text-xs text-gray-600">{formatTime(game.duration)}</div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button 
          onClick={togglePlay}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button 
          onClick={() => onAddMarker(currentTime, selectedPlayer)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          🏷️ Add Marker
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
          ✂️ Create Clip
        </button>
      </div>
    </div>
  );
};

// Player List Component
const PlayerList = ({ players, selectedPlayer, onSelectPlayer, onAddPlayer }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Team Roster</h3>
      <div className="space-y-2">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedPlayer?.id === player.id 
                ? 'bg-blue-100 border-2 border-blue-500' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="font-semibold">#{player.number} {player.name}</div>
            <div className="text-sm text-gray-600">{player.position}</div>
            <div className="text-xs text-blue-600">{player.markerCount} markers</div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAddPlayer}
        className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
      >
        + Add Player
      </button>
    </div>
  );
};

// Markers List Component
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Game Markers ({markers.length})</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {markers.map(marker => (
          <div
            key={marker.id}
            className={`p-3 rounded-lg border-l-4 ${
              marker.type === 'positive' ? 'border-green-500 bg-green-50' : 
              marker.type === 'improvement' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-blue-600">{formatTime(marker.timestamp)}</div>
                <div className="text-sm font-medium">{getPlayerName(marker.playerId)}</div>
                <div className="text-sm text-gray-700">{marker.description}</div>
                {marker.category && (
                  <div className="text-xs text-gray-500 mt-1">
                    {marker.category} • {marker.priority}
                  </div>
                )}
              </div>
              <button
                onClick={() => onDeleteMarker(marker.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {markers.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No markers yet. Click on the video to add some!
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user, signOut }) => {
  const [markers, setMarkers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data from AWS on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load players
        const { data: playersData } = await client.models.Player.list();
        setPlayers(playersData || []);
        
        // Load games  
        const { data: gamesData } = await client.models.Game.list();
        setGames(gamesData || []);
        
        // Set default selections
        if (playersData?.length > 0) {
          setSelectedPlayer(playersData[0]);
        }
        if (gamesData?.length > 0) {
          setSelectedGame(gamesData[0]);
          
          // Load markers for the selected game
          const { data: markersData } = await client.models.Marker.list({
            filter: { gameId: { eq: gamesData[0].id } }
          });
          setMarkers(markersData || []);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data from database. Using sample data.');
        
        // Fallback to mock data if database fails
        setPlayers(mockPlayers);
        setSelectedPlayer(mockPlayers[0]);
        setMarkers(mockMarkers);
        setSelectedGame(mockGame);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load markers when game changes
  useEffect(() => {
    const loadMarkers = async () => {
      if (selectedGame?.id) {
        try {
          const { data: markersData } = await client.models.Marker.list({
            filter: { gameId: { eq: selectedGame.id } }
          });
          setMarkers(markersData || []);
        } catch (error) {
          console.error('Error loading markers:', error);
        }
      }
    };

    loadMarkers();
  }, [selectedGame]);

  const handleAddMarker = async (timestamp, player) => {
    if (!player) {
      alert('Please select a player first!');
      return;
    }

    if (!selectedGame) {
      alert('Please select a game first!');
      return;
    }

    const description = prompt(`Add marker for ${player.name} at ${Math.floor(timestamp / 60)}:${Math.floor(timestamp % 60).toString().padStart(2, '0')}:`);
    
    if (description) {
      try {
        // Save to AWS database
        const { data: newMarker } = await client.models.Marker.create({
          timestamp: parseFloat(timestamp),
          playerId: player.id,
          gameId: selectedGame.id,
          description,
          type: 'positive', // Could add UI to select type
          category: 'general',
          priority: 'medium'
        });
        
        if (newMarker) {
          // Update local state
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
      // Delete from AWS database
      await client.models.Marker.delete({ id: markerId });
      
      // Update local state
      setMarkers(markers.filter(m => m.id !== markerId));
      
    } catch (error) {
      console.error('Error deleting marker:', error);
      alert('Failed to delete marker from database');
    }
  };

  const handleAddPlayer = async () => {
    const name = prompt('Player name:');
    const number = prompt('Jersey number:');
    const position = prompt('Position:');
    
    if (name && number && position) {
      try {
        const { data: newPlayer } = await client.models.Player.create({
          name,
          number: parseInt(number),
          position,
          team: 'Main Team',
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

  // Sample data seeding function
  const seedSampleData = async () => {
    try {
      console.log('Seeding sample data...');
      
      // Create sample players
      const samplePlayers = [
        { name: "John Smith", number: 23, position: "Point Guard", team: "Main Team", active: true },
        { name: "Mike Johnson", number: 10, position: "Center", team: "Main Team", active: true },
        { name: "Alex Brown", number: 7, position: "Forward", team: "Main Team", active: true },
        { name: "Chris Davis", number: 15, position: "Guard", team: "Main Team", active: true },
        { name: "Ryan Wilson", number: 32, position: "Forward", team: "Main Team", active: true }
      ];

      for (const player of samplePlayers) {
        await client.models.Player.create(player);
      }

      // Create a sample game
      await client.models.Game.create({
        opponent: "Lakers",
        date: "2024-03-15",
        gameType: "Regular",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: 2880,
        score: "110-105",
        notes: "Great team performance"
      });

      console.log('Sample data seeded successfully!');
      return true;
    } catch (error) {
      console.error('Error seeding sample data:', error);
      return false;
    }
  };

  const handleSeedData = async () => {
    const confirm = window.confirm('This will add sample players and a game to your database. Continue?');
    if (confirm) {
      const success = await seedSampleData();
      if (success) {
        alert('Sample data added successfully! Refreshing...');
        window.location.reload(); // Refresh to load new data
      } else {
        alert('Failed to seed sample data. Check console for errors.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading basketball platform...</p>
        </div>
      </div>
    );
  }

  // Use selected game or fallback to mock
  const currentGame = selectedGame || mockGame;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏀 Coach Platform</h1>
          <div className="flex items-center space-x-4">
            <nav className="space-x-4">
              <button className="hover:text-blue-200">Dashboard</button>
              <button className="hover:text-blue-200">Upload</button>
              <button className="hover:text-blue-200">Players</button>
              <button className="hover:text-blue-200">Settings</button>
            </nav>
            <div className="flex items-center space-x-3 border-l border-blue-400 pl-3">
              <span className="text-sm">Welcome, {user?.signInDetails?.loginId}</span>
              <button 
                onClick={signOut}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player - Takes up most space */}
          <div className="lg:col-span-3">
            <VideoPlayer 
              game={currentGame}
              markers={markers}
              onAddMarker={handleAddMarker}
              selectedPlayer={selectedPlayer}
            />
            
            {/* Markers List below video */}
            <div className="mt-6">
              <MarkersList 
                markers={markers}
                players={players}
                onDeleteMarker={handleDeleteMarker}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PlayerList 
              players={players}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
              onAddPlayer={handleAddPlayer}
            />
            
            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div>Total Markers: <span className="font-bold">{markers.length}</span></div>
                <div>Total Players: <span className="font-bold">{players.length}</span></div>
                <div>Selected Player: <span className="font-bold">{selectedPlayer?.name || 'None'}</span></div>
                <div>Current Game: <span className="font-bold">{currentGame?.opponent || 'None'}</span></div>
              </div>
              
              {/* Sample Data Button */}
              {players.length === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">No data found. Want to start with sample data?</p>
                  <button
                    onClick={handleSeedData}
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded text-sm hover:bg-purple-600 transition-colors"
                  >
                    🌱 Add Sample Data
                  </button>
                </div>
              )}
            </div>
          </div>
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