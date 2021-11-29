import {useState} from 'react'
import Flexbox from 'flexbox-react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../FirebaseApp';
import { useNavigate } from 'react-router'
import { getAuth, GoogleAuthProvider, EmailAuthProvider, signOut, onAuthStateChanged} from 'firebase/auth';

const auth = getAuth(firebaseApp)

const signOutClicked = ({auth, navigate}) => {
  signOut(auth)
  navigate(-1);
}

function LoginScreen() {
  const [ currentUser, setCurrentUser ] = useState()
  const navigate = useNavigate()
  onAuthStateChanged(auth, user => setCurrentUser(user))
  
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => navigate(-1)
    }
  };
  
  return (
    <Flexbox flexDirection='column' flex="1">
      {currentUser ?
       <button onClick={() => signOutClicked({auth, navigate})}>Sign Out</button> :
       <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      }
    </Flexbox>
  );
}

export default LoginScreen;
