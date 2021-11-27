import './MainLayout.css';
import {Outlet} from 'react-router-dom'
import Flexbox from 'flexbox-react'

// Placeholder, will eventually hold shared header stuff like login links, profile, etc.
const MainLayout = () => {
  return (
    <Flexbox flexDirection='column' justifyContent='center' alignItems='center' className="MainLayout" minHeight='100vh'>
      <Outlet/>
    </Flexbox>
  );
}

export default MainLayout
