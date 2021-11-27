import './HomeScreen.css';
import {useState} from 'react'
import RulesModal from './RulesModal'
import Flexbox from 'flexbox-react'

// Import the functions you need from the SDKs you need

function HomeScreen() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="HomeScreen">
      <header className="HomeScreen-header">
        <h1>Paper Scout V1</h1>
        <Flexbox flexDirection='row' alignItems='center' justifyContent='space-evenly' height='200px' width='200px'>
          <button>SCOUT</button>
          <button>LEECH</button>
        </Flexbox>
        <p onClick={() => setShowModal(true)}>How does this work?</p>
      </header>
      <RulesModal isOpen={showModal} onClose={() => setShowModal(false)}/>
    </div>
  );
}

export default HomeScreen;
