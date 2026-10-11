document.addEventListener("DOMContentLoaded", () => {
  const gridProdutos = document.querySelector(".produtos-grid");
  const botoesFiltro = document.querySelectorAll(".filtro-btn");
  const campoPesquisa = document.getElementById("campo-pesquisa"); // ID da sua barra de pesquisa
  const pesquisaIcone = document.querySelector(".pesquisa-icone"); // ID do botão/lupa (opcional)

  if (!gridProdutos) return;

  // 1. CARREGAR PRODUTOS DO ADMIN NA HOME
  const produtosAdmin =
    JSON.parse(localStorage.getItem("produtosCacaue")) || [];
  const cardDestaque = gridProdutos.querySelector(".card-destaque-vertical");

  produtosAdmin.forEach((prod) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-produto");
    // Atributos de dados para facilitar a filtragem por categoria/texto
    cardDiv.setAttribute("data-categoria", prod.categoria.toLowerCase());
    cardDiv.setAttribute("data-nome", prod.nome.toLowerCase());

    cardDiv.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}" class="img-produto" />
      <h4>${prod.nome}</h4>
      <p class="peso">${prod.categoria}</p>
      <span class="preco">R$ ${prod.preco}</span>
      <button class="btn-comprar" onclick="adicionarAoCarrinho('${prod.nome}', ${prod.preco.replace(",", ".")}, '${prod.imagem}', '${prod.quantidade || "1"} un')">
        Adicionar ao carrinho
      </button>
    `;

    if (cardDestaque) {
      gridProdutos.insertBefore(cardDiv, cardDestaque);
    } else {
      gridProdutos.appendChild(cardDiv);
    }
  });

  // Função genérica para filtrar todos os cards da tela
  function executarFiltro(termoBusca) {
    const termo = termoBusca.toLowerCase().trim();
    const todosCards = gridProdutos.querySelectorAll(".card-produto");

    todosCards.forEach((card) => {
      const titulo = card.querySelector("h4").textContent.toLowerCase();
      const descricao = card.querySelector(".peso").textContent.toLowerCase();

      // Se o título ou a categoria/peso incluírem o termo pesquisado, exibe; senão, oculta
      if (titulo.includes(termo) || descricao.includes(termo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // 2. FILTRAR AO CLICAR NOS BOTÕES (Mais vendidos, Chocolates, etc.)
  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Remove a classe 'ativo' de todos e coloca no clicado
      botoesFiltro.forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      const categoriaTexto = botao.textContent.toLowerCase();

      // Se clicar em "Mais vendidos", exibe todos (ou pode criar regra específica)
      if (categoriaTexto.includes("mais vendidos")) {
        executarFiltro(""); // Limpa o filtro e mostra tudo
      } else {
        executarFiltro(categoriaTexto);
      }
    });
  });

  // 3. FILTRAR PELA BARRA DE PESQUISA (Apertando ENTER)
  if (campoPesquisa) {
    campoPesquisa.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executarFiltro(campoPesquisa.value);
      }
    });
  }

  // 4. FILTRAR CLICANDO NA LUPA / BOTÃO DE PESQUISA
  if (pesquisaIcone && campoPesquisa) {
    pesquisaIcone.addEventListener("click", () => {
      executarFiltro(campoPesquisa.value);
    });
  }
});
