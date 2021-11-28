import Flexbox from 'flexbox-react'
import { useState, useEffect } from 'react'
import { fetchAndParseArxiv } from '../helpers/Arxiv'

const PER_PAGE = 10

const doSearch = async ({searchQuery, category, pageStart, setPageResults, setTotalResults}) => {
  const searchQueryFrag = searchQuery ? `all:${searchQuery}` : ''
  const { pageResults, totalResults } = await fetchAndParseArxiv(`search_query=${searchQueryFrag}+cat:${category}&sortBy=lastUpdatedDate&start=${pageStart}&max_results=${PER_PAGE}`)
  setPageResults(pageResults)
  setTotalResults(totalResults)
}

function ScoutScreen() {
  const [ category, setCategory ] = useState('cs.CL')
  const [ searchQuery, setSearchQuery ] = useState()
  const [ totalResults, setTotalResults ] = useState()
  const [ pageStart, setPageStart ] = useState(0)
  const [ pageResults, setPageResults ] = useState([])

  // Do a default search with only the category to populate the page.
  useEffect(() => doSearch({searchQuery, category, pageStart, setPageResults, setTotalResults}), [])

  return (
    <Flexbox flexDirection='column' flex="1">
      <Flexbox>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </Flexbox>
      <Flexbox flexDirection='column'>
        {pageResults.map(entry => {
          return <Flexbox flexDirection='column' justifyContent='flex-start' key={entry.id}>
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
