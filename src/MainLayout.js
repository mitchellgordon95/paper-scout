import {Outlet} from 'react-router-dom'

// Placeholder, will eventually hold shared header stuff like login links, profile, etc.
const MainLayout = () => {
  return (
    <div className="MainLayout">
      <Outlet/>
    </div>
  );
}

export default MainLayout
