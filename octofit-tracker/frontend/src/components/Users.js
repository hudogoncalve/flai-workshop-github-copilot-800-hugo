import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    team_id: '',
    power: '',
    fitness_level: 1
  });

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME || 'expert-space-chainsaw-7v76jvq44wvv2x46w'}-8000.app.github.dev/api/users/`;
  const TEAMS_URL = API_URL.replace('/users/', '/teams/');

  const fetchData = useCallback(() => {
    console.log('Fetching users from:', API_URL);
    console.log('Fetching teams from:', TEAMS_URL);
    
    Promise.all([
      fetch(API_URL),
      fetch(TEAMS_URL)
    ])
      .then(([usersRes, teamsRes]) => {
        if (!usersRes.ok || !teamsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        return Promise.all([usersRes.json(), teamsRes.json()]);
      })
      .then(([usersData, teamsData]) => {
        console.log('Users API raw data:', usersData);
        console.log('Teams API raw data:', teamsData);
        
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        setTeams(Array.isArray(teamsArray) ? teamsArray : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [API_URL, TEAMS_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      alias: user.alias,
      email: user.email,
      team_id: user.team_id,
      power: user.power,
      fitness_level: user.fitness_level
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      alias: '',
      email: '',
      team_id: '',
      power: '',
      fitness_level: 1
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fitness_level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}${editingUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh data
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user: ' + error.message);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => (t._id || t.id) === teamId);
    return team ? team.name : 'No Team';
  };

  if (loading) return <div className="alert alert-info">Loading users...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">👤 Users</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Alias</th>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Power</th>
                <th>Fitness Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><strong>{user.alias}</strong></td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge bg-info">{getTeamName(user.team_id)}</span></td>
                    <td>{user.power}</td>
                    <td>
                      <span className="badge bg-primary">{user.fitness_level}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User: {editingUser?.alias}</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Alias</label>
                    <input
                      type="text"
                      className="form-control"
                      name="alias"
                      value={formData.alias}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Team</label>
                    <select
                      className="form-select"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a team</option>
                      {teams.map(team => (
                        <option key={team._id || team.id} value={team._id || team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Power</label>
                    <input
                      type="text"
                      className="form-control"
                      name="power"
                      value={formData.power}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fitness Level (1-10)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="fitness_level"
                      min="1"
                      max="10"
                      value={formData.fitness_level}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
