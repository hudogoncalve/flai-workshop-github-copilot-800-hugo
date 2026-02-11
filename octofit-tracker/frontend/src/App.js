import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Activities',
      description: 'Track and view all fitness activities',
      icon: '🏃',
      path: '/activities'
    },
    {
      title: 'Leaderboard',
      description: 'See who\'s leading the fitness challenge',
      icon: '🏆',
      path: '/leaderboard'
    },
    {
      title: 'Teams',
      description: 'Join and manage fitness teams',
      icon: '👥',
      path: '/teams'
    },
    {
      title: 'Users',
      description: 'View all registered users',
      icon: '👤',
      path: '/users'
    },
    {
      title: 'Workouts',
      description: 'Browse workout plans and suggestions',
      icon: '💪',
      path: '/workouts'
    }
  ];

  return (
    <div>
      <div className="welcome-jumbotron text-center">
        <h1>Welcome to OctoFit Tracker</h1>
        <p className="lead">Track your fitness activities, join teams, and compete on the leaderboard!</p>
      </div>
      
      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card home-card" onClick={() => navigate(card.path)}>
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.icon}</div>
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit Logo" />
            OctoFit Tracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">Activities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">Workouts</Link>
              </li>
            </ul>
            <button 
              className="btn btn-sm btn-outline-light ms-auto"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
