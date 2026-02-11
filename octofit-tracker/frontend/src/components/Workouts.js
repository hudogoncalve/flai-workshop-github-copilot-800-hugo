import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME || 'expert-space-chainsaw-7v76jvq44wvv2x46w'}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Fetching workouts from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Workouts API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts API raw data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts data processed:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="alert alert-info">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">💪 Workouts</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Duration (min)</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <tr key={workout.id}>
                  <td>{workout.id}</td>
                  <td><strong>{workout.name}</strong></td>
                  <td>{workout.description}</td>
                  <td>
                    <span className={`badge bg-${
                      workout.difficulty === 'beginner' ? 'success' :
                      workout.difficulty === 'intermediate' ? 'warning' : 'danger'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </td>
                  <td>{workout.duration_minutes}</td>
                  <td>{workout.calories_per_session}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No workouts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Workouts;
