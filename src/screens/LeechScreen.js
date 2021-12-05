import './LeechScreen.css'
import { useState, useEffect } from 'react'
import Flexbox from 'flexbox-react'
import { useNavigate } from 'react-router'
import firebaseApp from '../FirebaseApp'
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
const db = getFirestore(firebaseApp)

function LeechScreen() {
  const navigate = useNavigate()
  const [users, setUsers] = useState()
  const [papers, setPapers] = useState()
  useEffect(() => {
    const userQuery = query(collection(db, 'users'), orderBy('points', 'desc'))
    onSnapshot(userQuery, (snapshot) =>
      setUsers(snapshot.docs.map((x) => ({ id: x.id, ...x.data() })))
    )
    const paperQuery = query(
      collection(db, 'papers'),
      orderBy('lifetimeEndorsements', 'desc')
    )
    onSnapshot(paperQuery, (snapshot) =>
      setPapers(snapshot.docs.map((x) => ({ id: x.id, ...x.data() })))
    )
  }, [])

  return (
    <Flexbox className="LeechScreen" flexDirection="row" flex="1" wrap="wrap">
      {users ? (
        <Flexbox flexDirection="column" flex="1" alignItems="center">
          <div>Leaderboard</div>
          {users.map((user) => (
            <div key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
              {user.displayName} ({user.points || 0} pts)
            </div>
          ))}
        </Flexbox>
      ) : (
        'Loading...'
      )}

      {papers ? (
        <Flexbox flexDirection="column" flex="1" alignItems="center">
          <div>Top Papers</div>
          <div>(Lifetime Endorsements)</div>
          {papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => navigate(`/paper/arxiv/${paper.id}`)}
            >
              {paper.title} ({paper.lifetimeEndorsements || 0})
            </div>
          ))}
        </Flexbox>
      ) : (
        'Loading...'
      )}
    </Flexbox>
  )
}

export default LeechScreen
