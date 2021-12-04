import functions from "firebase-functions";
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { fetchAndParseArxiv } from './arxiv.js'

const app = initializeApp()
const db = getFirestore(app)
const increment = FieldValue.increment(1);
const decrement = FieldValue.increment(-1);

export const endorsePaper = functions.https.onCall(async (data, context) => {
  const { paperId } = data
  // Note: we choose a '|' to separate schema from id because forward
  // slashes mess with firestore's id system.
  const [schema, arxivId] = paperId.split("|")

  if (schema !== 'arxiv') {
    throw new functions.https.HttpsError('invalid-argument', 'Unknown paper id schema.')
  }

  if (!context?.auth?.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Must be logged in to endorse papers')
  }

  const userId = context.auth.uid

  if(!context?.auth?.token?.email_verified) {
    throw new functions.https.HttpsError('failed-precondition', 'Please verify your email.')
  }

  const user = (await db.collection('users').doc(userId).get()).data()
  const paperInfo = (await fetchAndParseArxiv(`id_list=${arxivId}`)).pageResults[0]

  const userEndorsements = (await db.collection('endorsements')
    .where('userId', "==", userId)
    .orderBy('updatedAt')
    .get()).docs.map(doc => doc.data())

  const currentEndorsements = userEndorsements.filter(endorsement => !endorsement.deletedAt)

  if (currentEndorsements.length > 4) {
    throw new functions.https.HttpsError('failed-precondition', 'Too many endorsements. Please remove one via your profile page.')
  }

  if (userEndorsements.filter(endorsement => endorsement.paperId === paperId).length > 0) {
    throw new functions.https.HttpsError('failed-precondition', 'Paper already or previously endorsed.')
  }
  
  // Give users points
  const paperEndorsements = (await db.collection('endorsements')
    .where('paperId', "==", paperId)
    .get()).docs.map(doc => doc.data())
  paperEndorsements.filter(endorsement => !endorsement.deletedAt).map(endorsement => {
    db.collection('users').doc(endorsement.userId).update({points: increment})
  })

  // Track endorsements per paper
  db.collection('papers').doc(paperId).set({
    ...paperInfo,
    currentEndorsements: increment,
    lifetimeEndorsements: increment,
  }, {merge: true} )

  // Clients using onSnapshot will auto-pull DB changes, no need to return anything.
  db.collection('endorsements').add({
    paperId,
    userId,
    paperInfo,
    userDisplayName: user.displayName,
    updatedAt: Date.now(),
    deletedAt: null,
  })
  
});

export const removeEndorsement = functions.https.onCall(async (data, context) => {
  const { paperId } = data

  if (!context?.auth?.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Must be logged in to remove endorsements.')
  }
  const userId = context.auth.uid

  const endorsement = await db.collection('endorsements')
    .where('paperId', "==", paperId)
    .where('userId', "==", userId)
    .get()

  if (endorsement.data().deletedAt) {
    throw new functions.https.HttpsError('failed-precondition', 'Endorsement already removed.')
  }

  endorsement.docs[0].ref.update({deletedAt: Date.now()}) 
  db.collection('papers').doc(paperId).update({ currentEndorsements: decrement })
})
