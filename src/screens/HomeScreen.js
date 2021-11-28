import './HomeScreen.css';
import {useState} from 'react'
import RulesModal from '../modals/RulesModal'
import Flexbox from 'flexbox-react'
import {Link} from 'react-router-dom'

function HomeScreen() {
  const [showModal, setShowModal] = useState(false)

  return (
      <Flexbox flexDirection='column' justifyContent='center' alignItems='center' flex="1">
        <div className='HomeScreen-title'>
          <h1>Paper Scout V1</h1>
        </div>
        <Flexbox flexDirection='row' alignItems='center' justifyContent='space-evenly' height='200px' width='200px'>
          <button><Link to='/scout'>SCOUT</Link></button>
          <button>LEECH</button>
        </Flexbox>
        <p onClick={() => setShowModal(true)}>How does this work?</p>
        <RulesModal isOpen={showModal} onClose={() => setShowModal(false)}/>
      </Flexbox>
  );
}

export default HomeScreen;
