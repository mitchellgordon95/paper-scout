import './HomeScreen.css';
import {Outlet, Link} from 'react-router-dom'

// Import the functions you need from the SDKs you need

function HomeScreen() {
  return (
    <div className="HomeScreen">
      <header className="HomeScreen-header">
        <h1>Paper Scout V1</h1>
        <button>SCOUT</button>
        <button>LEECH</button>
        <Link to="/rules">How does this work?</Link>
      </header>
      <Outlet/>
    </div>
  );
}

export default HomeScreen;
