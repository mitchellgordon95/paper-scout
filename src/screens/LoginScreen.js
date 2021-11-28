import Flexbox from 'flexbox-react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../FirebaseApp';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';

const auth = getAuth(firebaseApp)
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
};

function LoginScreen() {
  return (
    <Flexbox flexDirection='column' flex="1">
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </Flexbox>
  );
}

export default LoginScreen;
