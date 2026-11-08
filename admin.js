// ================= LÓGICA DE PRODUTOS (COM FETCH) =================
window.addEventListener("DOMContentLoaded", () => {
  const formProduto = document.getElementById("form-produto");
  const corpoTabelaProdutos = document.querySelector("#tabela-produtos tbody");
  const botaoSalvarProduto = document.getElementById("botao-salvar-produto");
  let idProdutoEmEdicao = null;

  const API_PRODUTOS =
    "https://landing-unhearing-visible.ngrok-free.dev/produto";

  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 1. CARREGAR PRODUTOS (GET)
  async function carregarProdutosTabela() {
    try {
      const resposta = await fetch(API_PRODUTOS, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!resposta.ok) throw new Error("Erro ao buscar produtos.");

      const produtos = await resposta.json();
      corpoTabelaProdutos.innerHTML = "";

      produtos.forEach((prod, index) => {
        imagemSrc = `data:image/jpeg;base64,${prod.imagem}`;
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
          <td>${String(index + 1).padStart(2, "0")}</td>
          <td><img src="${imagemSrc || "./imagens/logo_Cacaue_arvore.png"}" alt="Foto" class="miniatura-tabela" /></td>
          <td>${prod.nome}</td>
          <td>${prod.categoria}</td>
          <td>R$ ${prod.preco}</td>
        
          <td>
            <button class="botao-tabela-editar" type="button" data-id="${prod.id}">Editar</button>
            <button class="botao-tabela-excluir" type="button" data-id="${prod.id}">Excluir</button>
          </td>
        `;
        corpoTabelaProdutos.appendChild(novaLinha);
      });
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  }

  carregarProdutosTabela();

  // 2. CADASTRAR (POST) E ATUALIZAR (PUT)
  if (formProduto) {
    formProduto.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("campo-nome-produto").value;
      const categoria = document.getElementById("campo-categoria").value;
      const precoInput = document.getElementById("campo-preco").value;
      //onst quantidade = document.getElementById("campo-quantidade").value;
      const inputImg = document.getElementById("campo-img");

      // const precoFormatado = precoInput
      //  ? parseFloat(precoInput).toFixed(2).replace(".", ",")
      //   : "0,00";
      //const qtdFormatada = quantidade ? quantidade : "0";

      //tratamento de imagem para base64

      const imagemPadrao = "./imagens/logo_Cacaue_arvore.png";

      let imagemFinal = imagemPadrao;
      if (inputImg.files && inputImg.files[0]) {
        const imagemBase64 = await converterParaBase64(inputImg.files[0]);
        const base64Limpo = imagemBase64.split(",")[1];
        imagemFinal = base64Limpo;
      }

      const dadosProduto = {
        nome,
        categoria,
        preco: precoInput,
        // preco: precoFormatado,
        //quantidade: qtdFormatada,
        imagem: imagemFinal,
      };

      console.log(dadosProduto);

      try {
        let urlEndpoint = API_PRODUTOS;
        let metodoHttp = "POST";

        if (idProdutoEmEdicao !== null) {
          urlEndpoint = `${API_PRODUTOS}/${idProdutoEmEdicao}`;
          metodoHttp = "PUT";
        }

        const resposta = await fetch(urlEndpoint, {
          method: metodoHttp,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosProduto),
        });

        console.log(idProdutoEmEdicao);
        if (resposta.ok) {
          mostrarNotificacao(
            idProdutoEmEdicao !== null
              ? "Produto atualizado com sucesso!"
              : "Produto cadastrado com sucesso!",
          );

          console.log(idProdutoEmEdicao);

          idProdutoEmEdicao = null;
          botaoSalvarProduto.textContent = "Salvar Produto";
          formProduto.reset();

          setTimeout(() => {
            carregarProdutosTabela();
          }, 1000);
        } else {
          mostrarNotificacao("Erro ao salvar produto no servidor.");
        }
      } catch (erro) {
        console.error("Erro na requisição de produtos:", erro);
        mostrarNotificacao("Erro de conexão com o servidor local.", "erro");
      }
    });

    // 3. EDITAR E EXCLUIR (DELETE)
    corpoTabelaProdutos.addEventListener("click", async (e) => {
      const alvo = e.target;
      const botaoExcluir = alvo.closest(".botao-tabela-excluir");
      const botaoEditar = alvo.closest(".botao-tabela-editar");

      if (botaoExcluir) {
        const idProduto = botaoExcluir.getAttribute("data-id");
        if (confirm("Deseja realmente remover este produto?")) {
          try {
            const resposta = await fetch(`${API_PRODUTOS}/${idProduto}`, {
              method: "DELETE",
            });
            if (resposta.ok) {
              mostrarNotificacao("Produto excluído com sucesso!");
              carregarProdutosTabela();
            } else {
              mostrarNotificacao("Erro ao excluir o produto no servidor.");
            }
          } catch (erro) {
            console.error("Erro ao excluir produto:", erro);
          }
        }
      }

      if (botaoEditar) {
        const idProduto = botaoEditar.getAttribute("data-id");
        idProdutoEmEdicao = idProduto;
        const linha = botaoEditar.closest("tr");

        document.getElementById("campo-nome-produto").value =
          linha.children[2].textContent;
        document.getElementById("campo-categoria").value =
          linha.children[3].textContent;
        document.getElementById("campo-preco").value =
          linha.children[4].textContent.replace("R$ ", "").replace(",", ".");
        //document.getElementById("campo-quantidade").value =
        //  linha.children[5].textContent;

        botaoSalvarProduto.textContent = "Atualizar Produto";
        document
          .getElementById("secao-formulario-produto")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

// ================= 2. LÓGICA DE FORNECEDORES (COM FETCH) =================
const formFornecedor = document.getElementById("form-fornecedor");
const corpoTabelaFornecedores = document.querySelector(
  "#tabela-fornecedores tbody",
);
const botaoSalvarFornecedor = document.getElementById(
  "botao-salvar-fornecedor",
);
let idFornecedorEmEdicao = null;

const API_FORNECEDORES =
  "https://landing-unhearing-visible.ngrok-free.dev/fornecedor";

// Função para buscar e listar os fornecedores do db.json na tabela
async function carregarFornecedoresTabela() {
  try {
    const resposta = await fetch(API_FORNECEDORES, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!resposta.ok) throw new Error("Erro ao buscar fornecedores.");

    const fornecedores = await resposta.json();
    corpoTabelaFornecedores.innerHTML = "";

    fornecedores.forEach((forn, index) => {
      const novaLinha = document.createElement("tr");
      novaLinha.innerHTML = `
          <td>${String(index + 1).padStart(2, "0")}</td>
          <td>${forn.nome}</td>
          <td>${forn.contato}</td>
          <td>${forn.cnpj}</td>
          <td>${forn.produto}</td>
          <td>
            <button class="botao-tabela-editar" type="button" data-id="${forn.id}">Editar</button>
            <button class="botao-tabela-excluir" type="button" data-id="${forn.id}">Excluir</button>
          </td>
        `;
      corpoTabelaFornecedores.appendChild(novaLinha);
    });
  } catch (erro) {
    console.error("Erro ao carregar fornecedores:", erro);
  }
}

// Chama a função para carregar os fornecedores assim que a página abre
carregarFornecedoresTabela();

if (formFornecedor) {
  formFornecedor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("campo-nome-fornecedor").value;
    const contato = document.getElementById("campo-contato").value;
    const cnpj = document.getElementById("campo-cnpj").value;
    const produto = document.getElementById("campo-produto-fornecido").value;

    const dadosFornecedor = { nome, contato, cnpj, produto };

    try {
      let urlEndpoint = API_FORNECEDORES;
      let metodoHttp = "POST";

      if (idFornecedorEmEdicao !== null) {
        urlEndpoint = `${API_FORNECEDORES}/${idFornecedorEmEdicao}`;
        metodoHttp = "PUT";
      }

      const resposta = await fetch(urlEndpoint, {
        method: metodoHttp,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosFornecedor),
      });

      if (resposta.ok) {
        mostrarNotificacao(
          idFornecedorEmEdicao !== null
            ? "Fornecedor atualizado com sucesso!"
            : "Fornecedor cadastrado com sucesso!",
        );
        idFornecedorEmEdicao = null;
        botaoSalvarFornecedor.textContent = "Salvar Fornecedor";
        formFornecedor.reset();
        carregarFornecedoresTabela();
      } else {
        mostrarNotificacao("Erro ao salvar fornecedor no servidor.");
      }
    } catch (erro) {
      console.error("Erro na requisição de fornecedores:", erro);
    }
  });

  corpoTabelaFornecedores.addEventListener("click", async (e) => {
    const alvo = e.target;
    const botaoExcluir = alvo.closest(".botao-tabela-excluir");
    const botaoEditar = alvo.closest(".botao-tabela-editar");

    // EXCLUIR FORNECEDOR (DELETE)
    if (botaoExcluir) {
      const idFornecedor = botaoExcluir.getAttribute("data-id");
      if (confirm("Deseja realmente remover este fornecedor?")) {
        try {
          const resposta = await fetch(`${API_FORNECEDORES}/${idFornecedor}`, {
            method: "DELETE",
          });
          if (resposta.ok) {
            mostrarNotificacao("Fornecedor excluído com sucesso!");
            carregarFornecedoresTabela();
          }
        } catch (erro) {
          console.error("Erro ao excluir fornecedor:", erro);
        }
      }
    }

    // EDITAR FORNECEDOR (PUT)
    if (botaoEditar) {
      const idFornecedor = botaoEditar.getAttribute("data-id");
      idFornecedorEmEdicao = idFornecedor;
      const linha = botaoEditar.closest("tr");

      document.getElementById("campo-nome-fornecedor").value =
        linha.children[1].textContent;
      document.getElementById("campo-contato").value =
        linha.children[2].textContent;
      document.getElementById("campo-cnpj").value =
        linha.children[3].textContent;
      document.getElementById("campo-produto-fornecido").value =
        linha.children[4].textContent;

      botaoSalvarFornecedor.textContent = "Atualizar Fornecedor";
      document
        .getElementById("secao-formulario-fornecedor")
        .scrollIntoView({ behavior: "smooth" });
    }
  });
}
