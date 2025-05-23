import React, { useState, useRef } from 'react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

const VideoUploadModal = ({ isOpen, onClose, onUploadComplete, selectedTeam }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gameData, setGameData] = useState({
    opponent: '',
    date: '',
    gameType: 'Regular',
    location: 'Home',
    score: '',
    ourScore: '',
    opponentScore: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);

  // Supported video formats
  const SUPPORTED_FORMATS = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
  const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024; // 4GB in bytes

  const validateFile = (file) => {
    const newErrors = {};
    
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      newErrors.file = 'Please upload a video file (MP4, MOV, or AVI format)';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      newErrors.file = 'File size must be less than 4GB';
    }
    
    return newErrors;
  };

  const validateGameData = () => {
    const newErrors = {};
    
    if (!selectedTeam) {
      newErrors.team = 'Please select a team first';
    }
    
    if (!gameData.opponent.trim()) {
      newErrors.opponent = 'Opponent name is required';
    }
    
    if (!gameData.date) {
      newErrors.date = 'Game date is required';
    }
    
    return newErrors;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileErrors = validateFile(file);
      
      if (Object.keys(fileErrors).length === 0) {
        setSelectedFile(file);
        setErrors({});
      } else {
        setErrors(fileErrors);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileErrors = validateFile(file);
      
      if (Object.keys(fileErrors).length === 0) {
        setSelectedFile(file);
        setErrors({});
      } else {
        setErrors(fileErrors);
      }
    }
  };

  const extractVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      
      video.onerror = () => {
        resolve(0); // Default duration if extraction fails
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const generateThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Seek to 10% of video duration for thumbnail
        video.currentTime = video.duration * 0.1;
      });
      
      video.addEventListener('seeked', () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const gameErrors = validateGameData();
    if (Object.keys(gameErrors).length > 0) {
      setErrors(gameErrors);
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    let newGame = null;
    
    try {
      // Create game record first
      const { data: createdGame } = await client.models.Game.create({
        opponent: gameData.opponent,
        date: gameData.date,
        gameType: gameData.gameType,
        location: gameData.location,
        score: gameData.score,
        ourScore: gameData.ourScore ? parseInt(gameData.ourScore) : null,
        opponentScore: gameData.opponentScore ? parseInt(gameData.opponentScore) : null,
        notes: gameData.notes,
        videoFileName: selectedFile.name,
        videoFileSize: selectedFile.size,
        uploadStatus: 'uploading',
        teamId: selectedTeam.id
      });

      if (!createdGame) {
        throw new Error('Failed to create game record');
      }

      newGame = createdGame;

      // Extract video duration
      const duration = await extractVideoDuration(selectedFile);
      
      // Generate video path with team organization in filename
      const videoPath = ({ identityId }) => `videos/${identityId}/team-${selectedTeam.id}/game-${newGame.id}/${selectedFile.name}`;
      
      // Upload video file
      const videoUpload = uploadData({
        path: videoPath,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 90); // Reserve 10% for final steps
              setUploadProgress(progress);
            }
          }
        }
      });

      const videoResult = await videoUpload.result;
      setUploadProgress(90);

      // Generate and upload thumbnail
      let thumbnailUrl = null;
      let thumbnailS3Key = null;
      
      try {
        const thumbnailBlob = await generateThumbnail(selectedFile);
        if (thumbnailBlob) {
          const thumbnailPath = ({ identityId }) => `thumbnails/${identityId}/team-${selectedTeam.id}/game-${newGame.id}/thumbnail.jpg`;
          const thumbnailResult = await uploadData({
            path: thumbnailPath,
            data: thumbnailBlob,
            options: {
              contentType: 'image/jpeg'
            }
          }).result;
          
          thumbnailS3Key = thumbnailResult.path;
          const thumbnailUrlResult = await getUrl({ path: thumbnailResult.path });
          thumbnailUrl = thumbnailUrlResult.url.toString();
        }
      } catch (thumbnailError) {
        console.warn('Thumbnail generation failed:', thumbnailError);
      }

      // Get signed URL for video
      const videoUrlResult = await getUrl({ path: videoResult.path });
      
      // Update game record with upload results
      await client.models.Game.update({
        id: newGame.id,
        videoUrl: videoUrlResult.url.toString(),
        videoS3Key: videoResult.path,
        thumbnailUrl,
        thumbnailS3Key,
        duration,
        uploadStatus: 'completed'
      });

      setUploadProgress(100);
      
      // Reset form
      setSelectedFile(null);
      setGameData({
        opponent: '',
        date: '',
        gameType: 'Regular',
        location: 'Home',
        score: '',
        ourScore: '',
        opponentScore: '',
        notes: ''
      });
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(newGame);
      }
      
      // Close modal after brief delay
      setTimeout(() => {
        onClose();
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ upload: 'Upload failed. Please try again.' });
      setUploading(false);
      setUploadProgress(0);
      
      // Update game status to failed if record was created
      if (newGame?.id) {
        try {
          await client.models.Game.update({
            id: newGame.id,
            uploadStatus: 'failed'
          });
        } catch (updateError) {
          console.error('Failed to update game status:', updateError);
        }
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Game Video</h2>
            <button
              onClick={onClose}
              disabled={uploading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!uploading ? (
            <>
              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-green-600">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Drag & drop your video file here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports MP4, MOV, AVI • Max 4GB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
              </div>

              {/* Game Details Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Game Details</h3>
                
                {/* Team Info Display */}
                {selectedTeam && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Uploading for: <span className="font-bold">{selectedTeam.name}</span>
                      {selectedTeam.ageGroup && ` (${selectedTeam.ageGroup})`}
                    </p>
                  </div>
                )}
                
                {errors.team && <p className="text-red-600 text-sm">{errors.team}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opponent *
                    </label>
                    <input
                      type="text"
                      value={gameData.opponent}
                      onChange={(e) => setGameData({...gameData, opponent: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Lakers"
                    />
                    {errors.opponent && <p className="text-red-600 text-sm mt-1">{errors.opponent}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Game Date *
                    </label>
                    <input
                      type="date"
                      value={gameData.date}
                      onChange={(e) => setGameData({...gameData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Game Type
                    </label>
                    <select
                      value={gameData.gameType}
                      onChange={(e) => setGameData({...gameData, gameType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Playoff">Playoff</option>
                      <option value="Practice">Practice</option>
                      <option value="Scrimmage">Scrimmage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={gameData.location}
                      onChange={(e) => setGameData({...gameData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Home">Home</option>
                      <option value="Away">Away</option>
                      <option value="Neutral">Neutral Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Our Score
                    </label>
                    <input
                      type="number"
                      value={gameData.ourScore}
                      onChange={(e) => setGameData({...gameData, ourScore: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 110"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opponent Score
                    </label>
                    <input
                      type="number"
                      value={gameData.opponentScore}
                      onChange={(e) => setGameData({...gameData, opponentScore: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 105"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Game Notes
                  </label>
                  <textarea
                    value={gameData.notes}
                    onChange={(e) => setGameData({...gameData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Game notes, key moments, coaching observations..."
                  />
                </div>
              </div>

              {errors.upload && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{errors.upload}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !gameData.opponent || !gameData.date || !selectedTeam}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Upload Video
                </button>
              </div>
              
              {!selectedTeam && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  ⚠️ Please select a team before uploading
                </p>
              )}
            </>
          ) : (
            /* Upload Progress */
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Uploading Video...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
              <p className="text-xs text-gray-500 mt-2">
                Please don't close this window while uploading...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal; 