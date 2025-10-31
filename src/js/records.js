document.getElementById("botaoMenu").onclick = function() {
    window.location.href = "index.html";
}
// Atualiza a tabela automaticamente (tempo real no Firestore; 1x no localStorage)
PhaserDB.attachLiveTable(10);

// Botão "Voltar ao menu"
document.getElementById("botaoMenu")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
