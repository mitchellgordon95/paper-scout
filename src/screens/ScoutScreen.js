import Flexbox from 'flexbox-react'
import { useState } from 'react'
import { fetchAndParseArxiv } from '../helpers/Arxiv'

function ScoutScreen() {
  const [ category, setCategory ] = useState('cs.CL')
  const [ searchQuery, setSearchQuery ] = useState()
  const [ searchResults, setSearchResults ] = useState([])

  fetchAndParseArxiv('search_query=all:electron&sortBy=lastUpdatedDate&start=0').then(result => console.log(result))

  return (
    <Flexbox flexDirection='column' flex="1">
      <Flexbox>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </Flexbox>
    </Flexbox>
  );
}

export default ScoutScreen;
