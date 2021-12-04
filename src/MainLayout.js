import './MainLayout.css'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import { useLocation, useNavigate } from 'react-router'
import firebaseApp from './FirebaseApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth(firebaseApp)

// Placeholder, will eventually hold shared header stuff like login links, profile, etc.
const MainLayout = () => {
  const [currentUser, setCurrentUser] = useState()
  onAuthStateChanged(auth, (user) => setCurrentUser(user))
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <Flexbox
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className="MainLayout"
      minHeight="100vh"
    >
      {/* Only show the header (login, home button) when we're not on the home screen */}
      {!location.pathname || location.pathname === '/' ? (
        ''
      ) : (
        <Flexbox
          flexDirection="row"
          justifyContent="space-between"
          minWidth="80vw"
        >
          <h3 onClick={() => navigate('/')}>Paper Scout</h3>
          {currentUser ? (
            <p onClick={() => navigate(`/user/${currentUser.uid}`)}>Profile</p>
          ) : (
            <p onClick={() => navigate('/login')}>Login</p>
          )}
        </Flexbox>
      )}
      <Outlet />
    </Flexbox>
  )
}

export default MainLayout
