import { useState, useEffect } from 'react'
import Flexbox from 'flexbox-react'
import { useNavigate, useParams } from 'react-router'
import firebaseApp from '../FirebaseApp'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const functions = getFunctions(firebaseApp)

const removeEndorsementCloudFunction = httpsCallable(
  functions,
  'removeEndorsement'
)

const sendVerificationEmail = (user) => {
  alert('Verification email sent.')
  sendEmailVerification(user)
}

function ProfileScreen() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState()
  const [endorsements, setEndorsements] = useState()
  const [currentUser, setCurrentUser] = useState()

  onAuthStateChanged(auth, (user) => setCurrentUser(user))

  useEffect(() => {
    getDoc(doc(db, 'users', userId)).then((user) => setUser(user.data()))
    const q = query(
      collection(db, 'endorsements'),
      where('userId', '==', userId),
      orderBy('updatedAt')
    )
    onSnapshot(q, (snapshot) =>
      setEndorsements(snapshot.docs.map((x) => ({ id: x.id, ...x.data() })))
    )
  }, [userId])

  const currentEndorsements = endorsements
    ? endorsements.filter((e) => !e.deletedAt)
    : []
  const pastEndorsements = endorsements
    ? endorsements.filter((e) => e.deletedAt)
    : []

  const EndorsementComponent = ({ endorsement }) => {
    return (
      <div>
        <div>
          <span
            onClick={() => navigate(`/paper/arxiv/${endorsement.paperInfo.id}`)}
          >
            {endorsement.paperInfo.title}
          </span>
          {!endorsement.deletedAt &&
          currentUser &&
          userId === currentUser.uid ? (
            <button
              onClick={() => {
                // eslint-disable-nextline no-restricted-globals
                const confirmed = window.confirm(
                  `Are you sure you want to remove your endorsement of ${endorsement.paperInfo.title}?`
                )
                if (confirmed)
                  removeEndorsementCloudFunction({
                    paperId: endorsement.paperId,
                  })
              }}
            >
              X
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }

  return (
    <Flexbox flexDirection="column" flex="1" maxWidth="80vw">
      {user ? (
        <Flexbox flexDirection="column" alignItems="flex-start">
          <h1>{user.displayName}</h1>
          {currentUser &&
          userId === currentUser.uid &&
          !currentUser.emailVerified ? (
            <button onClick={() => sendVerificationEmail(currentUser)}>
              Not Verified
            </button>
          ) : (
            ''
          )}
          {currentUser && userId === currentUser.uid ? (
            <button onClick={() => signOut(auth)}>Sign Out</button>
          ) : (
            ''
          )}
          <div>Points {user.points || '0'}</div>
        </Flexbox>
      ) : (
        'Loading...'
      )}
      {currentEndorsements ? (
        <Flexbox flexDirection="column">
          <div>Endorsements:</div>
          {currentEndorsements.map((endorsement) => (
            <EndorsementComponent
              endorsement={endorsement}
              key={endorsement.id}
            />
          ))}
        </Flexbox>
      ) : (
        'Loading...'
      )}
      {pastEndorsements ? (
        <Flexbox flexDirection="column">
          <div>Past Endorsements:</div>
          {pastEndorsements.map((endorsement) => (
            <EndorsementComponent
              endorsement={endorsement}
              key={endorsement.id}
            />
          ))}
        </Flexbox>
      ) : (
        'Loading...'
      )}
    </Flexbox>
  )
}

export default ProfileScreen
