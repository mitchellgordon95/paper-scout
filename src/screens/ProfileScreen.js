import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { useNavigate, useParams } from 'react-router'
import firebaseApp from '../FirebaseApp';
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, orderBy} from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

function ProfileScreen() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState()
  const [endorsements, setEndorsements] = useState()
  const [ currentUser, setCurrentUser ] = useState()

  onAuthStateChanged(auth, user => setCurrentUser(user))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getDoc(doc(db, "users", userId)).then(user => setUser(user.data()))
    const q = query(
      collection(db, 'endorsements'),
      where('userId', "==", userId),
      orderBy('updatedAt')
    );
    onSnapshot(q, snapshot => setEndorsements(snapshot.docs.map(x => x.data())))
  }, [])

  return (
    <Flexbox flexDirection='column' flex="1">
      { user ?
        <Flexbox flexDirection='column' alignItems='flex-start'>
          <h1>{user.displayName}</h1>
          {currentUser && userId === currentUser.uid ? <button onClick={() => signOut(auth)}>Sign Out</button> : ""}
          <div>Points {user.points || '0'}</div>
        </Flexbox>
        : "Loading..."
      }
      { endorsements ?
          <Flexbox flexDirection='column'>
            <div>Endorsements:</div>
          {
            endorsements.map(endorsement =>
              <div key={endorsement.id} onClick={() => navigate(`/paper/arxiv/${endorsement.paperInfo.id}`)}>
                {endorsement.paperInfo.title}
              </div>)
          }
          </Flexbox>
        : "Loading..."
      }
    </Flexbox>
  );
}

export default ProfileScreen;
