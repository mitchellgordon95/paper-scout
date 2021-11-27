import './HomeScreen.css';
import {useState} from 'react'
import RulesModal from './RulesModal'

// Import the functions you need from the SDKs you need

function HomeScreen() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="HomeScreen">
      <header className="HomeScreen-header">
        <h1>Paper Scout V1</h1>
        <button>SCOUT</button>
        <button>LEECH</button>
        <p onClick={() => setShowModal(true)}>How does this work?</p>
      </header>
      <RulesModal isOpen={showModal} onClose={() => setShowModal(false)}/>
    </div>
  );
}

export default HomeScreen;
