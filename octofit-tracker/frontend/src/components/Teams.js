import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME || 'expert-space-chainsaw-7v76jvq44wvv2x46w'}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Fetching teams from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Teams API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams API raw data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams data processed:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">👥 Teams</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Members</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map(team => (
                <tr key={team._id || team.id}>
                  <td>{team._id || team.id}</td>
                  <td><strong>{team.name}</strong></td>
                  <td>{team.description}</td>
                  <td>
                    <span className="badge bg-info">{team.member_count || 0}</span>
                  </td>
                  <td>{new Date(team.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No teams found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teams;
