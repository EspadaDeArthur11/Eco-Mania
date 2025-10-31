// ...existing code...
(function () {
  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const hasFirebase = typeof firebase !== "undefined" && firebase.firestore;
  if (!hasFirebase) {
    const err = new Error(
      "[StorageDB] Firebase não inicializado. Inclua os scripts compat do Firebase ANTES de storage.js e verifique a configuração."
    );
    console.error(err);

    // API que falha explicitamente para avisar o responsável
    window.StorageDB = {
      saveScore() {
        return Promise.reject(err);
      },
      listenTopScores() {
        // lançar para avisar imediatemente quem chamou
        throw err;
      }
    };

    // PhaserDB compat: funções que propagam o erro de forma explícita
    window.PhaserDB = window.PhaserDB || {
      async reportScore({ name, score, metadata } = {}) {
        return Promise.reject(err);
      },

      attachLiveTable() {
        console.error("[PhaserDB] não pode anexar tabela: Firebase ausente.");
        return () => {};
      }
    };

    // Parar aqui (sem fallback)
    return;
  }

  // Se chegou aqui, Firebase está disponível
  const db = firebase.firestore();
  const scoresRef = db.collection("scores");

  const StorageDBImpl = {
    async saveScore({ name = "Jogador", score = 0, metadata = {} } = {}) {
      const safeName = (typeof name === "string" && name.trim()) ? name.trim() : "Jogador";
      const numericScore = Number(score) || 0;
      const data = {
        name: safeName,
        score: numericScore,
        metadata: metadata || {},
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      try {
        const docRef = await scoresRef.add(data);
        return { id: docRef.id, ...data };
      } catch (e) {
        console.error("[StorageDB] erro ao salvar score:", e);
        throw e;
      }
    },

    listenTopScores(limit = 10, cb = () => {}) {
      const q = scoresRef.orderBy("score", "desc").limit(limit);
      const unsubscribe = q.onSnapshot(snapshot => {
        const rows = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          const ts = d.createdAt && d.createdAt.toMillis ? d.createdAt.toMillis() : (d.createdAt || Date.now());
          rows.push({
            id: doc.id,
            name: d.name,
            score: d.score,
            timestamp: typeof ts === "number" ? ts : Date.now(),
            metadata: d.metadata || {}
          });
        });
        try { cb(rows); } catch (e) { console.error("[StorageDB] callback error:", e); }
      }, err => {
        // Avisar explicitamente sobre erro do Firestore
        console.error("[StorageDB] erro no onSnapshot:", err);
        try { cb([]); } catch (e) { console.error("[StorageDB] callback after error failed:", e); }
      });

      return unsubscribe;
    }
  };

  // Expor API global
  window.StorageDB = window.StorageDB || StorageDBImpl;

  // PhaserDB compat (usado por phaser.js / records.js)
  window.PhaserDB = window.PhaserDB || {
    async reportScore({ name, score, metadata } = {}) {
      return window.StorageDB.saveScore({ name, score, metadata });
    },

    attachLiveTable(limit = 10) {
      const tbody = document.getElementById("records-body");
      if (!tbody) {
        console.warn("[PhaserDB] tbody#records-body não encontrado.");
        return () => {};
      }

      const unsubscribe = window.StorageDB.listenTopScores(limit, (rows) => {
        tbody.innerHTML = "";
        let rank = 1;
        rows.forEach(r => {
          const date = r.timestamp ? new Date(r.timestamp).toLocaleString("pt-BR") : "Agora";
          tbody.insertAdjacentHTML("beforeend", `
            <tr>
              <td>${rank++}</td>
              <td>${escapeHtml(r.name)}</td>
              <td>${Number(r.score)}</td>
              <td>${escapeHtml(date)}</td>
            </tr>
          `);
        });
      });

      return typeof unsubscribe === "function" ? unsubscribe : () => {};
    }
  };
})();