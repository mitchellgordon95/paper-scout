import {useState} from 'react'
import Flexbox from 'flexbox-react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../FirebaseApp';
import { useNavigate } from 'react-router'
import { getAuth, GoogleAuthProvider, EmailAuthProvider, signOut, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc} from 'firebase/firestore';

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

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
      signInSuccess: async (currentUser) => {
        await setDoc(doc(db, "users", currentUser.uid), {
          displayName: currentUser.displayName,
          points: 0
        })
        if (!currentUser.emailVerified) {
          sendEmailVerification(currentUser)
          alert('A verification email has been sent.')
        }
        navigate(-1)
      }
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
