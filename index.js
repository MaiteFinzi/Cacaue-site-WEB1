document.addEventListener("DOMContentLoaded", () => {
  const gridProdutos = document.querySelector(".produtos-grid");
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const pesquisaIcone = document.querySelector(".pesquisa-icone");

  if (!gridProdutos) return;

  const API_PRODUTOS = "http://localhost:3000/produtos";
  const cardDestaque = gridProdutos.querySelector(".card-destaque-vertical");

  // 1. CARREGAR PRODUTOS DA API (db.json) NA HOME
  async function carregarProdutosHome() {
    try {
      const resposta = await fetch(API_PRODUTOS);
      if (!resposta.ok) throw new Error("Erro ao buscar produtos.");

      const produtos = await resposta.json();

      // Remove cards antigos injetados anteriormente para evitar duplicatas ao recarregar
      const cardsAntigos = gridProdutos.querySelectorAll(".card-produto");
      cardsAntigos.forEach((card) => card.remove());

      produtos.forEach((prod) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card-produto");

        // Trata caso a categoria ou nome venham vazios
        const categoriaTexto = prod.categoria || "Geral";
        const nomeTexto = prod.nome || "Produto";
        const precoTexto = prod.preco || "0,00";
        const imagemSrc = prod.imagem || "./imagens/logo_Cacaue_arvore.png";
        const quantidadeTexto = prod.quantidade || "1";

        cardDiv.setAttribute("data-categoria", categoriaTexto.toLowerCase());
        cardDiv.setAttribute("data-nome", nomeTexto.toLowerCase());

        // Converte o preço de string ("15,90") para número para o carrinho (ex: 15.90)
        const precoNumerico = parseFloat(
          String(precoTexto).replace(".", "").replace(",", "."),
        );

        cardDiv.innerHTML = `
          <img src="${imagemSrc}" alt="${nomeTexto}" class="img-produto" />
          <h4>${nomeTexto}</h4>
          <p class="peso">${categoriaTexto}</p>
          <span class="preco">R$ ${precoTexto}</span>
          <button class="btn-comprar" onclick="adicionarAoCarrinho('${nomeTexto}', ${precoNumerico}, '${imagemSrc}', '${quantidadeTexto} un')">
            Adicionar ao carrinho
          </button>
        `;

        if (cardDestaque) {
          gridProdutos.insertBefore(cardDiv, cardDestaque);
        } else {
          gridProdutos.appendChild(cardDiv);
        }
      });
    } catch (erro) {
      console.error("Erro ao carregar produtos na home:", erro);
    }
  }

  carregarProdutosHome();

  // 2. Função para filtrar todos os cards da tela
  function executarFiltro(termoBusca) {
    const termo = termoBusca.toLowerCase().trim();
    const todosCards = gridProdutos.querySelectorAll(".card-produto");

    todosCards.forEach((card) => {
      const titulo = card.querySelector("h4").textContent.toLowerCase();
      const descricao = card.querySelector(".peso").textContent.toLowerCase();

      if (titulo.includes(termo) || descricao.includes(termo)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Filtrar apertando Enter
  if (campoPesquisa) {
    campoPesquisa.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executarFiltro(campoPesquisa.value);
      }
    });
  }

  // Filtrar clicando na lupa
  if (pesquisaIcone && campoPesquisa) {
    pesquisaIcone.addEventListener("click", () => {
      executarFiltro(campoPesquisa.value);
    });
  }

  // Filtrar em tempo real
  if (campoPesquisa) {
    campoPesquisa.addEventListener("input", (e) => {
      executarFiltro(e.target.value);
    });
  }
});
