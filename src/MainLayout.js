import './MainLayout.css';
import {Outlet} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// Placeholder, will eventually hold shared header stuff like login links, profile, etc.
const MainLayout = () => {
  return (
    <Flexbox flexDirection='column' justifyContent='center' alignItems='center' className="MainLayout" minHeight='100vh'>
      <Outlet/>
      <Flexbox minHeight="50px">
        <a href="https://github.com/mitchellgordon95/paper-scout">
          <FontAwesomeIcon icon={faGithub} size="2x"/>
        </a>
      </Flexbox>
    </Flexbox>
  );
}

export default MainLayout
