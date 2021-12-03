import functions from "firebase-functions";
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { fetchAndParseArxiv } from './arxiv.js'



const app = initializeApp()
const db = getFirestore(app)
const increment = FieldValue.increment(1);

export const endorsePaper = functions.https.onRequest(async (request, response) => {
  const { paperId, userId } = request.query

  // TODO (mitchg) - check auth

  const user = (await db.collection('users').doc(userId).get()).data()
  const paperInfo = (await fetchAndParseArxiv(`id_list=${paperId}`)).pageResults[0]

  const userEndorsements = (await db.collection('endorsements')
    .where('userId', "==", userId)
    .orderBy('updatedAt')
    .get()).docs.map(doc => doc.data())

  const currentEndorsements = userEndorsements.filter(endorsement => !endorsement.deletedAt)

  if (currentEndorsements.length > 4) {
    response.status(500).send("Too many endorsements.")
    return
  }

  if (userEndorsements.filter(endorsement => endorsement.paperId === paperId).length > 0) {
    response.status(500).send("Paper already endorsed.")
    return
  }
  
  const paperEndorsements = (await db.collection('endorsements')
    .where('paperId', "==", paperId)
    .get()).docs.map(doc => doc.data())

  paperEndorsements.filter(endorsement => !endorsement.deletedAt).map(endorsement => {
    db.collection('users').doc(endorsement.userId).update({points: increment})
  })

  db.collection('endorsements').add({
    paperId,
    userId,
    paperInfo,
    userDisplayName: user.displayName,
    updatedAt: Date.now(),
    deletedAt: null,
  })
  
  // Clients using onSnapshot will auto-pull DB changes.
  response.status(200).send('ok')

});
