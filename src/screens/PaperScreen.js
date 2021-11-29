import './PaperScreen.css';
import { useParams } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { collection, getFirestore, onSnapshot, addDoc, query, where, orderBy} from 'firebase/firestore';
import firebaseApp from '../FirebaseApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { fetchAndParseArxiv } from '../helpers/Arxiv'
import { useNavigate } from 'react-router'

const auth = getAuth(firebaseApp)
const db = getFirestore();

const getPaperInfo = async ({paperId}) => {
  // TODO (mitchg) - we should probably double check that there's only
  // one result. An easy edge case here is when there are multiple
  // versions of the paper. Which one do we display? Do we redirect to
  // a version-specific page?
  return (await fetchAndParseArxiv(`id_list=${paperId}`)).pageResults[0]
}

const endorsePaper = async ({paperId, currentUser, endorsements, setEndorsements, navigate}) => {
  if (!currentUser) {
    navigate('/login')
  }
  else {
    await addDoc(collection(db, 'endorsements'), {
      paperId: `arxiv://${paperId}`,
      userId: currentUser.uid,
      userDisplayName: currentUser.displayName,
      updatedAt: Date.now(),
    })
  }
}

function PaperScreen() {
  const { paperId } = useParams()
  const [ paperInfo, setPaperInfo ] = useState({})
  const [ endorsements, setEndorsements ] = useState([])
  const [ currentUser, setCurrentUser ] = useState()
  const navigate = useNavigate()
  onAuthStateChanged(auth, user => setCurrentUser(user))

  useEffect(() => {
    getPaperInfo({paperId}).then(info => setPaperInfo(info))

    // Listen for changes to the endorsements for this paper
    const q = query(
      collection(db, 'endorsements'),
      where('paperId', "==", `arxiv://${paperId}`),
      orderBy('updatedAt')
    );
    onSnapshot(q, snapshot => setEndorsements(snapshot.docs.map(x => x.data())))
  }, [paperId])

  const userAlreadyEndorsed = endorsements && endorsements.filter(ed => ed.userId === currentUser?.uid).length > 0
  return (
    <Flexbox flexDirection='column' className="PaperScreen" flex="1" alignItems='center' maxWidth='80vw'>
      <h2>{paperInfo.title || "Loading..."}</h2>
      {/* TODO: clicking a category searches for the category in /scout */}
      <div>{paperInfo.categories ? paperInfo.categories.join(" ") : ""}</div>
      {/* TODO: clicking an author searches for the author in /scout */}
      <div>{paperInfo.authors ? paperInfo.authors.join(", ") : ""}</div>
      <br/>
      <div>{paperInfo.abstract}</div>
      <br/>
      { userAlreadyEndorsed ? '' : <button onClick={() => endorsePaper({paperId, currentUser, endorsements, setEndorsements, navigate})}>Endorse</button>}
      Endorsed By:
      {endorsements.map(endorsement => <p key={endorsement.userId}>{endorsement.userDisplayName}</p>)}
    </Flexbox>
  );
}

export default PaperScreen;
