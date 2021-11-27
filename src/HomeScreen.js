import './HomeScreen.css';
import {useState} from 'react'
import Modal from 'react-modal'


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
      <Modal isOpen={showModal}>
        Rules go here
      </Modal>
    </div>
  );
}

export default HomeScreen;
