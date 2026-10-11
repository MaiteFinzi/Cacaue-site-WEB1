//----------------------------CARRINHO--------------------------------

// 1. Array que armazena os itens do carrinho (busca do localStorage ou inicia vazio)
let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoCacau")) || [];

// Seleciona os elementos da tela (caso existam na página atual)
const contadorElemento = document.getElementById("carrinho-contador");
const listaItensContainer = document.getElementById("carrinho-lista-itens");
const subtotalElemento = document.getElementById("carrinho-subtotal");
const totalElemento = document.getElementById("carrinho-total");

// Atualiza o contador assim que qualquer página carregar
atualizarContador();

// 2. Função universal para adicionar um produto ao carrinho (usada na página principal)
function adicionarAoCarrinho(nome, preco, imagem, peso) {
  // Verifica se o produto já existe no carrinho
  const itemExistente = carrinhoItens.find((item) => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinhoItens.push({
      nome: nome,
      preco: preco,
      imagem: imagem,
      peso: peso,
      quantidade: 1,
    });
  }

  salvarCarrinho();
  atualizarContador();
  alert(`${nome} foi adicionado ao carrinho!`);
}

// 3. Atualiza o número da bolinha vermelha no header
function atualizarContador() {
  if (contadorElemento) {
    const totalItens = carrinhoItens.reduce(
      (soma, item) => soma + item.quantidade,
      0,
    );
    contadorElemento.textContent = totalItens;
  }
}

// 4. Salva os dados no navegador para a página do carrinho ler
function salvarCarrinho() {
  localStorage.setItem("carrinhoCacau", JSON.stringify(carrinhoItens));
}

// 5. Função para renderizar os itens na tela (usada na página carrinho.html)
function renderizarCarrinho() {
  if (!listaItensContainer) return; // Se não estiver na página do carrinho, para por aqui

  listaItensContainer.innerHTML = "";
  let subtotal = 0;

  carrinhoItens.forEach((produto, index) => {
    subtotal += produto.preco * produto.quantidade;

    const itemCard = document.createElement("div");
    itemCard.classList.add("carrinho-item");

    itemCard.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="carrinho-item-imagem">
      <div class="carrinho-item-detalhes">
        <h4 class="carrinho-item-titulo">${produto.nome}</h4>
        <span class="carrinho-item-peso">${produto.peso}</span>
        
        <div class="carrinho-item-controles">
          <div class="quantidade-controle">
            <button onclick="alterarQuantidade(${index}, -1)">-</button>
            <span class="quantidade-valor">${produto.quantidade}</span>
            <button onclick="alterarQuantidade(${index}, 1)">+</button>
          </div>
          <button class="botao-remover" onclick="removerItem(${index})">Remover</button>
        </div>
      </div>
      <div class="carrinho-item-preco">
        R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}
      </div>
    `;

    listaItensContainer.appendChild(itemCard);
  });

  if (subtotalElemento)
    subtotalElemento.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  if (totalElemento)
    totalElemento.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
}

// 6. Funções de controle de quantidade e remoção (usadas na página carrinho.html)
function alterarQuantidade(index, delta) {
  carrinhoItens[index].quantidade += delta;

  if (carrinhoItens[index].quantidade < 1) {
    carrinhoItens[index].quantidade = 1;
  }

  salvarCarrinho();
  renderizarCarrinho();
  atualizarContador();
}

function removerItem(index) {
  carrinhoItens.splice(index, 1);
  salvarCarrinho();
  renderizarCarrinho();
  atualizarContador();
}

// Executa a renderização se estiver na página do carrinho ao carregar
document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrinho();
});

function finalizarCompraWhatsApp() {
  // Verifica se o carrinho está vazio
  if (carrinhoItens.length === 0) {
    alert("O seu carrinho está vazio!");
    return;
  }

  const seuNumeroWhatsApp = "5534988348444";

  let mensagem = "Olá! Gostaria de fazer o seguinte pedido na Cacauê:\n\n";
  let totalGeral = 0;

  // Adiciona cada item à mensagem
  carrinhoItens.forEach((item) => {
    let subtotalItem = item.preco * item.quantidade;
    totalGeral += subtotalItem;
    mensagem += `* ${item.quantidade}x ${item.nome} (${item.peso}) - R$ ${subtotalItem.toFixed(2).replace(".", ",")}\n`;
  });

  mensagem += `\n*Total do pedido: R$ ${totalGeral.toFixed(2).replace(".", ",")}*\n\nAguardo instruções de pagamento e entrega!`;

  // Codifica a mensagem para o formato de URL do WhatsApp
  const mensagemCodificada = encodeURIComponent(mensagem);

  // Abre o WhatsApp com a mensagem pronta
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${seuNumeroWhatsApp}&text=${mensagemCodificada}`;
  window.open(urlWhatsApp, "_blank");
}
