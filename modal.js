function criarElementoNotificacao() {
  let modal = document.getElementById("modal-notificacao-global");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-notificacao-global";
    document.body.appendChild(modal);
  }
  return modal;
}

// Função global para disparar a notificação
function mostrarNotificacao(mensagem, tipo = "sucesso") {
  const modal = criarElementoNotificacao();

  // Define as classes visuais (base + tipo: sucesso ou erro)
  modal.className = `modal-notificacao-flutuante ${tipo}`;
  modal.textContent = mensagem;

  // Pequeno timeout para garantir que a transição CSS ocorra corretamente
  setTimeout(() => {
    modal.classList.add("mostrar");
  }, 10);

  // Oculta o modal após 3,5 segundos
  setTimeout(() => {
    modal.classList.remove("mostrar");
  }, 10000);
}
