import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME || 'expert-space-chainsaw-7v76jvq44wvv2x46w'}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    console.log('Fetching activities from:', API_URL);
    
    fetch(API_URL)
      .then(response => {
        console.log('Activities API response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities API raw data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities data processed:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">🏃 Activities</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Calories</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.user_id}</td>
                  <td>{activity.workout_name}</td>
                  <td>{activity.duration_minutes}</td>
                  <td>{activity.distance_km}</td>
                  <td>{activity.calories_burned}</td>
                  <td>{new Date(activity.activity_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
