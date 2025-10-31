// Preenche a tabela de recordes em tempo real (top 10)
PhaserDB.attachLiveTable(10);

// Voltar ao menu
document.getElementById("botaoMenu")?.addEventListener("click", () => {
  window.location.href = "index.html";
});
