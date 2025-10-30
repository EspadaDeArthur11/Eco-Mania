// storage.js
// Firestore: salvar/listar/escutar scores

// Garante que o app Firebase esteja inicializado (compat).
if (!firebase.apps?.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const db = firebase.firestore();

// Salva uma pontuação
async function saveScore({ name, score }) {
  const doc = {
    name: String(name || "Jogador").slice(0, 32),
    score: Number(score || 0),
    timestamp: Date.now()
  };
  const ref = await db.collection("scores").add(doc);
  return { id: ref.id, ...doc };
}

// Busca top N (desc)
async function getTopScores(limit = 10) {
  const snap = await db
    .collection("scores")
    .orderBy("score", "desc")
    .limit(Number(limit || 10))
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Escuta top N em tempo real (retorna unsubscribe)
function listenTopScores(limit = 10, callback) {
  return db
    .collection("scores")
    .orderBy("score", "desc")
    .limit(Number(limit || 10))
    .onSnapshot(snap => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(rows);
    }, err => console.error("[storage.js] onSnapshot error:", err));
}

window.StorageDB = { saveScore, getTopScores, listenTopScores };

