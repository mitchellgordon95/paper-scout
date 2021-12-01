import {useState, useEffect} from 'react'
import Flexbox from 'flexbox-react'
import { useNavigate } from 'react-router'
import firebaseApp from '../FirebaseApp';
import { getFirestore, collection, onSnapshot, orderBy, query} from 'firebase/firestore';
const db = getFirestore(firebaseApp)

function LeechScreen() {
  const navigate = useNavigate()
  const [ users, setUsers ] = useState()
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc')
    );
    onSnapshot(q, snapshot => setUsers(snapshot.docs.map(x => ({id: x.id, ...x.data()}))))
  }, [])
  console.log(users)
  
  return (
    <Flexbox flexDirection='column' flex="1">
    { users ?
      <Flexbox flexDirection='column'>
        <div>Leaderboard:</div>
        {
          users.map(user =>
            <div key={user.id} onClick={()=>navigate(`/user/${user.id}`)}>
              {user.displayName} ({user.points || 0} pts)
            </div>)
        }
      </Flexbox>
      : 'Loading...'
    }
    </Flexbox>
  );
}

export default LeechScreen;
