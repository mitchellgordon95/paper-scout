import './PaperScreen.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Flexbox from 'flexbox-react'
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import firebaseApp from '../FirebaseApp'
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { fetchAndParseArxiv } from '../helpers/Arxiv'
import { useNavigate } from 'react-router'

const auth = getAuth(firebaseApp)
const db = getFirestore()
const functions = getFunctions(firebaseApp)

const PaperInfoComponent = ({ paperInfo }) => {
  return (
    <Flexbox flexDirection="column" alignItems="center">
      <h2>{paperInfo.title}</h2>
      {/* TODO: clicking a category searches for the category in /scout */}
      <div>{paperInfo.categories ? paperInfo.categories.join(' ') : ''}</div>
      {/* TODO: clicking an author searches for the author in /scout */}
      <div>{paperInfo.authors ? paperInfo.authors.join(', ') : ''}</div>
      <Flexbox width="100%" justifyContent="space-evenly">
        <a href={paperInfo.arxivLink} target="_blank">
          arxiv
        </a>
        <a href={paperInfo.pdfLink} target="_blank">
          pdf
        </a>
      </Flexbox>
      <div>{paperInfo.abstract}</div>
    </Flexbox>
  )
}

const getPaperInfo = async ({ paperId }) => {
  // TODO (mitchg) - we should probably double check that there's only
  // one result. An easy edge case here is when there are multiple
  // versions of the paper. Which one do we display? Do we redirect to
  // a version-specific page?
  return (await fetchAndParseArxiv(`id_list=${paperId}`)).pageResults[0]
}

const endorsePaper = async ({
  paperId,
  currentUser,
  navigate,
  setEndorsing,
}) => {
  if (!currentUser) {
    navigate('/login')
  } else if (!currentUser.emailVerified) {
    sendEmailVerification(currentUser)
    alert('Please verify your email. A verification email has been sent.')
  } else {
    // Note: the new endorsement will be auto-pulled from the snapshot observer
    setEndorsing(true)
    const endorsePaperCloudFunction = httpsCallable(functions, 'endorsePaper')
    endorsePaperCloudFunction({ paperId: `arxiv|${paperId}` })
      .then((res) => setEndorsing(false))
      .catch((err) => {
        console.log(err)
        alert(err.message)
      })
  }
}

function PaperScreen() {
  const { paperId } = useParams()
  const [paperInfo, setPaperInfo] = useState()
  const [endorsements, setEndorsements] = useState([])
  const [endorsing, setEndorsing] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const navigate = useNavigate()
  onAuthStateChanged(auth, (user) => setCurrentUser(user))

  // TODO (mitchg) - For now, do the stupid thing and just strip the version string.
  if (paperId[paperId.length - 2] === 'v') {
    navigate(`/paper/arxiv/${paperId.slice(0, -2)}`)
  }

  useEffect(() => {
    getPaperInfo({ paperId }).then((info) => setPaperInfo(info))

    // Listen for changes to the endorsements for this paper
    const q = query(
      collection(db, 'endorsements'),
      where('paperId', '==', `arxiv|${paperId}`),
      orderBy('updatedAt')
    )
    onSnapshot(q, (snapshot) =>
      setEndorsements(snapshot.docs.map((x) => x.data()))
    )
  }, [paperId])

  const userAlreadyEndorsed =
    endorsements &&
    endorsements.filter((ed) => ed.userId === currentUser?.uid).length > 0
  return (
    <Flexbox
      flexDirection="column"
      className="PaperScreen"
      flex="1"
      alignItems="center"
      maxWidth="80vw"
    >
      {paperInfo ? <PaperInfoComponent paperInfo={paperInfo} /> : 'Loading...'}
      <br />
      {userAlreadyEndorsed ? (
        ''
      ) : endorsing ? (
        <div>Loading...</div>
      ) : (
        <button
          onClick={() =>
            endorsePaper({ paperId, currentUser, navigate, setEndorsing })
          }
        >
          Endorse
        </button>
      )}
      Endorsed By:
      {endorsements.map((endorsement) => (
        <p
          key={endorsement.userId}
          onClick={() => navigate(`/user/${endorsement.userId}`)}
        >
          {endorsement.userDisplayName}
        </p>
      ))}
    </Flexbox>
  )
}

export default PaperScreen
