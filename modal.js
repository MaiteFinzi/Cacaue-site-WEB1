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

  // Oculta o modal após 10 segundos
  setTimeout(() => {
    modal.classList.remove("mostrar");
  }, 10000);
}

// Modal de confirmação
function criarElementoConfirmacao() {
  let overlay = document.getElementById("modal-confirmacao-global");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "modal-confirmacao-global";
    overlay.className = "modal-confirmacao-overlay";
    overlay.innerHTML = `
      <div class="modal-confirmacao-caixa">
        <h4 class="modal-confirmacao-titulo" id="modal-confirmacao-titulo"></h4>
        <p class="modal-confirmacao-mensagem" id="modal-confirmacao-mensagem"></p>
        <div class="modal-confirmacao-botoes">
          <button type="button" class="btn-confirmacao-cancelar" id="btn-modal-cancelar">Cancelar</button>
          <button type="button" class="btn-confirmacao-ok" id="btn-modal-confirmar">Excluir</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  return overlay;
}

// Função global para substituir o confirm() nativo
function confirmarAcao(mensagem, titulo = "Confirmar exclusão") {
  return new Promise((resolve) => {
    const overlay = criarElementoConfirmacao();
    const tituloEl = overlay.querySelector("#modal-confirmacao-titulo");
    const mensagemEl = overlay.querySelector("#modal-confirmacao-mensagem");
    const btnConfirmar = overlay.querySelector("#btn-modal-confirmar");
    const btnCancelar = overlay.querySelector("#btn-modal-cancelar");

    tituloEl.textContent = titulo;
    mensagemEl.textContent = mensagem;

    setTimeout(() => {
      overlay.classList.add("mostrar");
    }, 10);

    const fechar = (resultado) => {
      overlay.classList.remove("mostrar");
      btnConfirmar.removeEventListener("click", aoConfirmar);
      btnCancelar.removeEventListener("click", aoCancelar);
      overlay.removeEventListener("click", aoClicarFora);
      resolve(resultado);
    };

    const aoConfirmar = () => fechar(true);
    const aoCancelar = () => fechar(false);
    const aoClicarFora = (e) => {
      if (e.target === overlay) fechar(false);
    };

    btnConfirmar.addEventListener("click", aoConfirmar);
    btnCancelar.addEventListener("click", aoCancelar);
    overlay.addEventListener("click", aoClicarFora);
  });
}
