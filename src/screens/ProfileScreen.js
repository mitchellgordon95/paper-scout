import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { useNavigate, useParams } from 'react-router'
import firebaseApp from '../FirebaseApp';
import { getFirestore, collection, doc, getDoc, onSnapshot, query, where, orderBy} from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const functions = getFunctions(firebaseApp)

const removeEndorsementCloudFunction = httpsCallable(functions, 'removeEndorsement')

function ProfileScreen() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState()
  const [endorsements, setEndorsements] = useState()
  const [ currentUser, setCurrentUser ] = useState()

  onAuthStateChanged(auth, user => setCurrentUser(user))

  useEffect(() => {
    getDoc(doc(db, "users", userId)).then(user => setUser(user.data()))
    const q = query(
      collection(db, 'endorsements'),
      where('userId', "==", userId),
      orderBy('updatedAt')
    );
    onSnapshot(q, snapshot => setEndorsements(snapshot.docs.map(x => x.data())))
  }, [userId])

  const currentEndorsements = endorsements ? endorsements.filter(e => !e.deletedAt) : []
  const pastEndorsements = endorsements ? endorsements.filter(e => e.deletedAt) : []

  const endorsementComponent = (endorsement) => 
              <div key={endorsement.id} >
                <div onClick={() => navigate(`/paper/arxiv/${endorsement.paperInfo.id}`)}>
                  {endorsement.paperInfo.title}
                </div>
                {!endorsement.deletedAt && currentUser && userId === currentUser.uid ?
                 <button onClick={() => removeEndorsementCloudFunction({paperId: endorsement.paperId})}>Remove</button> : ""}
              </div>

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
      { currentEndorsements ?
          <Flexbox flexDirection='column'>
            <div>Endorsements:</div>
            {currentEndorsements.map(endorsementComponent)}
          </Flexbox>
        : "Loading..."
      }
      { pastEndorsements ?
          <Flexbox flexDirection='column'>
            <div>Past Endorsements:</div>
            {pastEndorsements.map(endorsementComponent)}
          </Flexbox>
        : "Loading..."
      }
    </Flexbox>
  );
}

export default ProfileScreen;
