import React, { useState } from 'react';

const TeamSelector = ({ teams, selectedTeam, onSelectTeam, onCreateTeam }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: '',
    season: '',
    ageGroup: '',
    sport: 'Basketball'
  });

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamData.name.trim()) return;

    try {
      await onCreateTeam(newTeamData);
      setNewTeamData({
        name: '',
        description: '',
        season: '',
        ageGroup: '',
        sport: 'Basketball'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Teams</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Team</span>
        </button>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h4>
          <p className="text-gray-600 mb-4">Create your first team to start organizing players and games</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => onSelectTeam(team)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedTeam?.id === team.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{team.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {team.ageGroup && <span className="mr-3">🏀 {team.ageGroup}</span>}
                    {team.season && <span className="mr-3">📅 {team.season}</span>}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      team.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {team.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {team.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {team.description.length > 100 
                        ? `${team.description.substring(0, 100)}...` 
                        : team.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Create New Team</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={newTeamData.name}
                    onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Varsity Eagles"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group
                    </label>
                    <select
                      value={newTeamData.ageGroup}
                      onChange={(e) => setNewTeamData({...newTeamData, ageGroup: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Age Group</option>
                      <option value="U-12">U-12</option>
                      <option value="U-14">U-14</option>
                      <option value="U-16">U-16</option>
                      <option value="U-18">U-18</option>
                      <option value="JV">JV (Junior Varsity)</option>
                      <option value="Varsity">Varsity</option>
                      <option value="Adult">Adult</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Season
                    </label>
                    <input
                      type="text"
                      value={newTeamData.season}
                      onChange={(e) => setNewTeamData({...newTeamData, season: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2024-25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTeamData.description}
                    onChange={(e) => setNewTeamData({...newTeamData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional team description..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelector; 