import * as functions from "firebase-functions";

// TODO (mitchg) - irritatingly, Cloud Functions for Firebase does not
// implement the ES Module syntax from v9 of the firebase package (and
// v10 of the admin package).

// https://firebase.google.com/docs/admin/migrate-node-v10
// https://github.com/firebase/firebase-tools/issues/2994

export const endorsePaper = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
