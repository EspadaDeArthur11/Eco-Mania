// storage.js
const db = firebase.firestore();
const scoresRef = db.collection("scores");

window.PhaserDB = {
  async reportScore({ name, score }) {
    try {
      await scoresRef.add({
        name,
        score,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("[storage] Pontuação salva:", name, score);
    } catch (e) {
      console.error("[storage] Erro ao salvar:", e);
      throw e;
    }
  },

  attachLiveTable(limit = 10) {
    const tbody = document.getElementById("records-body");
    if (!tbody) return;

    scoresRef.orderBy("score", "desc").limit(limit).onSnapshot((snap) => {
      tbody.innerHTML = "";
      let rank = 1;
      snap.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate().toLocaleString("pt-BR") || "Agora";
        tbody.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${rank++}</td>
            <td>${data.name}</td>
            <td>${data.score}</td>
            <td>${date}</td>
          </tr>
        `);
      });
    });
  }
};
