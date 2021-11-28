import {useState} from 'react'
import Flexbox from 'flexbox-react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../FirebaseApp';
import { getAuth, GoogleAuthProvider, EmailAuthProvider, signOut, onAuthStateChanged} from 'firebase/auth';

const auth = getAuth(firebaseApp)

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
};

const signOutClicked = (auth) => {
  signOut(auth)
  window.location.replace("/");
}

function LoginScreen() {
  const [ currentUser, setCurrentUser ] = useState()
  onAuthStateChanged(auth, user => setCurrentUser(user))
  
  return (
    <Flexbox flexDirection='column' flex="1">
      {currentUser ?
       <button onClick={() => signOutClicked(auth)}>Sign Out</button> :
       <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      }
    </Flexbox>
  );
}

export default LoginScreen;
