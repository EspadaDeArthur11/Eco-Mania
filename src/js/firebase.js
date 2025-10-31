
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCoYDEOTGJeOuuGKSqamAflKT8Y7HzPhOs",
  authDomain: "ecomania-81cfa.firebaseapp.com",
  projectId: "ecomania-81cfa",
  storageBucket: "ecomania-81cfa.appspot.com",
  appId: "1:870049766827:web:f1d1738b12884f9fe446ee",
};

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const db = firebase.firestore();
console.log("🔥 Firebase inicializado");

