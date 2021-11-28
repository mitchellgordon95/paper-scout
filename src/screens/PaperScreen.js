import './PaperScreen.css';
import { useParams } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { collection, getFirestore, getDocs, addDoc, query, where, orderBy} from 'firebase/firestore';
import firebaseApp from '../FirebaseApp'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth(firebaseApp)
const db = getFirestore();

const getPaperInfo = async ({paperId}) => {
  const resp = await fetch(`https://export.arxiv.org/api/query?id_list=${paperId}`)
  const xmlStr = await resp.text()
  const parser = new DOMParser();
  const results = parser.parseFromString(xmlStr, 'text/xml')
  // TODO (mitchg) - we should probably double check that there's only
  // one result. An easy edge case here is when there are multiple
  // versions of the paper. Which one do we display? Do we redirect to
  // a version-specific page?
  const firstResult = results.getElementsByTagName('entry')[0]
  const authorList = Array.from(firstResult.getElementsByTagName('author'))
  const categories = Array.from(firstResult.getElementsByTagName('category'))

  return {
    title: firstResult.getElementsByTagName('title')[0].textContent,
    abstract: firstResult.getElementsByTagName('summary')[0].textContent,
    authors: authorList.map(author => author.getElementsByTagName('name')[0].textContent),
    categories: categories.map(category => category.getAttribute('term'))
  }
}

const getEndorsements = async ({paperId}) => {
  const q = query(
    collection(db, 'endorsements'),
    where('paperId', "==", `arxiv://${paperId}`),
    orderBy('updatedAt')
  );
  return getDocs(q)
}

const endorsePaper = async ({paperId, currentUser, endorsements, setEndorsements}) => {
  if (!currentUser) {
    window.location.replace('/login')
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
  onAuthStateChanged(auth, user => setCurrentUser(user))

  useEffect(() => {
    getPaperInfo({paperId}).then(info => setPaperInfo(info))
    getEndorsements({paperId}).then(results => setEndorsements(results.docs.map(x=>x.data())))
  }, [paperId])
  console.log({endorsements})

  const userAlreadyEndorsed = endorsements && endorsements.filter(ed => ed.userId === currentUser?.uid).length > 0
  return (
    <Flexbox flexDirection='column' className="PaperScreen" flex="1">
      <h2>{paperInfo.title || "Loading..."}</h2>
      <h5>{paperInfo.categories ? paperInfo.categories.join(" ") : ""}</h5>
      <h4>{paperInfo.authors ? paperInfo.authors.join(", ") : ""}</h4>
      <p>{paperInfo.abstract}</p>
      { userAlreadyEndorsed ? '' : <button onClick={() => endorsePaper({paperId, currentUser, endorsements, setEndorsements})}>Endorse</button>}
      Endorsed By:
      {endorsements.map(endorsement => <p key={endorsement.userId}>{endorsement.userDisplayName}</p>)}
    </Flexbox>
  );
}

export default PaperScreen;
