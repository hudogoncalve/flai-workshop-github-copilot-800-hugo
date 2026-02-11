import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME || 'expert-space-chainsaw-7v76jvq44wvv2x46w'}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Fetching leaderboard from:', API_URL);
    const teamsURL = API_URL.replace('/leaderboard/', '/teams/');
    
    // Fetch teams first to map team_id to team name
    Promise.all([
      fetch(API_URL),
      fetch(teamsURL)
    ])
      .then(([leaderboardRes, teamsRes]) => {
        if (!leaderboardRes.ok || !teamsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        return Promise.all([leaderboardRes.json(), teamsRes.json()]);
      })
      .then(([leaderboardData, teamsData]) => {
        console.log('Leaderboard API raw data:', leaderboardData);
        console.log('Teams API raw data:', teamsData);
        
        // Create teams lookup map
        const teamsArray = teamsData.results || teamsData;
        const teamsMap = {};
        teamsArray.forEach(team => {
          teamsMap[team._id || team.id] = team.name;
        });
        
        const leaderboardArray = leaderboardData.results || leaderboardData;
        console.log('Leaderboard data processed:', leaderboardArray);
        
        setTeams(teamsMap);
        setLeaderboard(Array.isArray(leaderboardArray) ? leaderboardArray : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">🏆 Leaderboard</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Total Minutes</th>
              <th>Total Workouts</th>
              <th>Total Distance</th>
              <th>Total Calories</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td>
                    <span className={`badge ${
                      entry.rank === 1 ? 'bg-warning' :
                      entry.rank === 2 ? 'bg-secondary' :
                      entry.rank === 3 ? 'bg-info' : 'bg-light text-dark'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td><strong>{entry.user_alias}</strong> ({entry.user_name})</td>
                  <td>{teams[entry.team_id] || 'No Team'}</td>
                  <td><strong>{entry.total_minutes || 0} min</strong></td>
                  <td>{entry.total_workouts || 0}</td>
                  <td>{(entry.total_distance_km || 0).toFixed(2)} km</td>
                  <td><strong>{entry.total_calories || 0}</strong></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No leaderboard data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
