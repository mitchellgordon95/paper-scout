import './HomeScreen.css';
import {useState} from 'react'
import RulesModal from '../modals/RulesModal'
import Flexbox from 'flexbox-react'
import { useNavigate } from 'react-router'

function HomeScreen() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  return (
      <Flexbox flexDirection='column' justifyContent='center' alignItems='center' flex="1">
        <div className='HomeScreen-title'>
          <h1>Paper Scout V1</h1>
        </div>
        <Flexbox flexDirection='row' alignItems='center' justifyContent='space-evenly' height='200px' width='200px'>
          <button onClick={() => navigate('/scout')}>SCOUT</button>
          <button onClick={() => navigate('/leech')}>LEECH</button>
        </Flexbox>
        <p onClick={() => setShowModal(true)}>How does this work?</p>
        <RulesModal isOpen={showModal} onClose={() => setShowModal(false)}/>
      </Flexbox>
  );
}

export default HomeScreen;
