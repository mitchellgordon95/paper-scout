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
  const [ currentPage, setCurrentPage ] = useState(0)
  const [ totalResults, setTotalResults] = useState()
  const [ pageResults, setPageResults ] = useState([])

  const doSearch = async ({pageNumber}) => {
    const searchQueryFrag = searchQuery ? `all:${escape(searchQuery)}+AND+` : ''
    const { pageResults, totalResults } = await fetchAndParseArxiv(`search_query=${searchQueryFrag}cat:${category}&sortBy=lastUpdatedDate&start=${pageNumber * PER_PAGE}&max_results=${PER_PAGE}`)
    setPageResults(pageResults)
    setTotalResults(totalResults)
  }

  const onSearchSubmit = (e) => {
    e.preventDefault()
    doSearch({pageNumber: 0})
    setCurrentPage(0)
  }

  const searchNextPage = () => {
    setCurrentPage(currentPage + 1)
    doSearch({pageNumber: currentPage+1})
  }

  const searchPrevPage = () => {
    setCurrentPage(currentPage - 1)
    doSearch({pageNumber: currentPage-1})
  }

  // Do a default search with only the category to populate the page.
  useEffect(() => doSearch({pageNumber: 0}), [])
  const nextPageButton = <button onClick={searchNextPage}>Next</button>
  const prevPageButton = <button onClick={searchPrevPage}>Prev</button>

  return (
    <Flexbox flexDirection='column' flex="1" alignItems='flex-start'>
      <Flexbox>
        <form onSubmit={onSearchSubmit}>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <input type="submit" value="Submit" />
        </form>
      </Flexbox>
      <div>Results: {totalResults}</div>
      <div>Page: {currentPage}</div>
      <Flexbox flexDirection='row'>
        {currentPage > 0 ?  prevPageButton : ''}
        {nextPageButton}
      </Flexbox>
      <Flexbox flexDirection='column'>
        {pageResults.map(entry => {
          return <Flexbox flexDirection='column' justifyContent='flex-start' key={entry.id} onClick={() => navigateToPaper({paperId: entry.id})}>
            <h4>{entry.title}</h4>
            <div>{entry.authors ? entry.authors.join(", ") : ""}</div>
            <div>{entry.abstract.slice(0,200) + "..."}</div>
          </Flexbox>
          })
        }
      </Flexbox>
      <Flexbox flexDirection='row'>
        {currentPage > 0 ?  prevPageButton : ''}
        {nextPageButton}
      </Flexbox>
    </Flexbox>
  );
}

export default ScoutScreen;
