import * as functions from "firebase-functions";
import { initializeApp } from 'firebase-admin/app'
import { getFirestore} from 'firebase-admin/firestore'
import { fetchAndParseArxiv } from './arxiv'

const app = initializeApp()
const db = getFirestore(app)

export const endorsePaper = functions.https.onRequest(async (request, response) => {
  const { paperId, userId } = request.query

  // TODO - check auth
  // TODO (mitchg) - irritatingly, Cloud Functions for Firebase does not
  // implement the nice ES Module syntax from v9 of the firebase package.

  const user = (await db.collection('users').doc(userId).get()).data()
  const paperInfo = (await fetchAndParseArxiv(`id_list=${paperId}`)).pageResults[0]

  const endorsements = (await db.collection('endorsements')
    .where('userId', "==", userId)
    .orderBy('updatedAt')
    .get()).docs.map(doc => doc.data())

  const currentEndorsements = endorsements.filter(endorsement => !endorsement.deletedAt)

  if (currentEndorsements.length > 4) {
    response.status(500).send("Too many endorsements.")
    return
  }

  if (endorsements.filter(endorsement => endorsement.paperId === paperId)) {
    response.status(500).send("Paper already endorsed.")
    return
  }

  db.collection('endorsements').addDoc({
    paperId,
    userId,
    paperInfo,
    userDisplayName: user.displayName,
    updatedAt: Date.now(),
    deletedAt: null,
  })

  // Clients using onSnapshot will auto-pull DB changes
  response.status(200)
});
