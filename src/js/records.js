document.getElementById("botaoMenu").onclick = function() {
    window.location.href = "index.html";
}
// Preenche a tabela de recordes ao vivo (Firestore) / 1x (localStorage fallback)
PhaserDB.attachLiveTable(10);

document.getElementById("botaoMenu").addEventListener("click", () => {
  window.location.href = "index.html";
});
