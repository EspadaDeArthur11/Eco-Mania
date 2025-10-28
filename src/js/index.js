document.getElementById("botaoJogar").onclick = function() {
    window.location.href = "game.html";
}

document.getElementById("botaoRec").onclick = function() {
    window.location.href = "records.html";
}
// Navegação dos botões da página inicial
document.getElementById("botaoJogar")?.addEventListener("click", () => {
  window.location.href = "game.html";
});

document.getElementById("botaoRec")?.addEventListener("click", () => {
  window.location.href = "records.html";
});

//  Modo daltônico: salva/recupera preferência
const daltonico = document.getElementById("mdal");
if (daltonico) {
  // aplica estado salvo
  const saved = localStorage.getItem("eco.daltonico") === "1";
  daltonico.checked = saved;
  document.documentElement.dataset.daltonico = saved ? "1" : "0";

  // atualiza quando marcar/desmarcar
  daltonico.addEventListener("change", () => {
    localStorage.setItem("eco.daltonico", daltonico.checked ? "1" : "0");
    document.documentElement.dataset.daltonico = daltonico.checked ? "1" : "0";
  });
}
