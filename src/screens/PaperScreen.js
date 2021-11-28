import './PaperScreen.css';
import { useParams } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { collection, getFirestore, getDocs, query, where } from 'firebase/firestore';


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
  const db = getFirestore();
  const q = query(collection(db, 'endorsements'), where('paperId', "==", `arxiv://${paperId}`));
  return getDocs(q)
}

function PaperScreen() {
  const { paperId } = useParams()
  const [ paperInfo, setPaperInfo ] = useState({})
  const [ endorsements, setEndorsements ] = useState([])
  useEffect(() => {
    getPaperInfo({paperId}).then(info => setPaperInfo(info))
    getEndorsements({paperId}).then(results => setEndorsements(results.docs.map(x=>x.data())))
  }, [paperId])
  return (
    <Flexbox flexDirection='column' className="PaperScreen" flex="1">
      <h2>{paperInfo.title || "Loading..."}</h2>
      <h5>{paperInfo.categories ? paperInfo.categories.join(" ") : ""}</h5>
      <h4>{paperInfo.authors ? paperInfo.authors.join(", ") : ""}</h4>
      <p>{paperInfo.abstract}</p>
      Endorsed By:
      {endorsements.map(endorsement => <p>{endorsement.userId}</p>)}
    </Flexbox>
  );
}

export default PaperScreen;
