import Flexbox from 'flexbox-react'
import { useState, useEffect } from 'react'
import { fetchAndParseArxiv } from '../helpers/Arxiv'

const PER_PAGE = 10

const navigateToPaper = ({paperId}) => {
  window.location.replace(`/paper/arxiv/${paperId}`)
}

function ScoutScreen() {
  const [ category, setCategory ] = useState('cs.CL')
  const [ searchQuery, setSearchQuery ] = useState()
  const [ totalResults, setTotalResults ] = useState()
  const [ pageStart, setPageStart ] = useState(0)
  const [ pageResults, setPageResults ] = useState([])

  const doSearch = async () => {
    const searchQueryFrag = searchQuery ? `all:${escape(searchQuery)}+AND+` : ''
    const { pageResults, totalResults } = await fetchAndParseArxiv(`search_query=${searchQueryFrag}cat:${category}&sortBy=lastUpdatedDate&start=${pageStart}&max_results=${PER_PAGE}`)
    setPageResults(pageResults)
    setTotalResults(totalResults)
  }

  // Do a default search with only the category to populate the page.
  useEffect(doSearch, [])

  return (
    <Flexbox flexDirection='column' flex="1">
      <Flexbox>
        <form onSubmit={(e) => {e.preventDefault(); doSearch()}}>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <input type="submit" value="Submit" />
        </form>
      </Flexbox>
      <Flexbox flexDirection='column'>
        {pageResults.map(entry => {
          return <Flexbox flexDirection='column' justifyContent='flex-start' key={entry.id} onClick={() => navigateToPaper({paperId: entry.id})}>
            <h4>{entry.title}</h4>
            <p>{entry.authors ? entry.authors.join(", ") : ""}</p>
            <p>{entry.abstract.slice(0,200) + "..."}</p>
          </Flexbox>
          })
        }
      </Flexbox>
    </Flexbox>
  );
}

export default ScoutScreen;
