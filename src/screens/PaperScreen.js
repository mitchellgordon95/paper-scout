import './PaperScreen.css';
import { useParams } from 'react-router-dom'
import {useState} from 'react'
import Flexbox from 'flexbox-react'

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

function PaperScreen() {
  const { paperId } = useParams()
  const [ paperInfo, setPaperInfo ] = useState({})
  getPaperInfo({paperId}).then(info => setPaperInfo(info))
  return (
    <Flexbox flexDirection='column' className="PaperScreen">
      <h2>{paperInfo.title}</h2>
      <h5>{paperInfo.categories ? paperInfo.categories.join(" ") : ""}</h5>
      <h4>{paperInfo.authors ? paperInfo.authors.join(", ") : ""}</h4>
      <p>{paperInfo.abstract}</p>
    </Flexbox>
  );
}

export default PaperScreen;
