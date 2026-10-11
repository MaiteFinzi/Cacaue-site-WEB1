window.addEventListener("DOMContentLoaded", () => {
  // ================= LÓGICA DE PRODUTOS =================
  const formProduto = document.getElementById("form-produto");
  const corpoTabelaProdutos = document.querySelector("#tabela-produtos tbody");
  const botaoSalvarProduto = document.getElementById("botao-salvar-produto");
  let linhaProdutoEmEdicao = null;

  // Função para carregar produtos salvos na tabela ao abrir a página
  function carregarProdutosTabela() {
    const produtos = JSON.parse(localStorage.getItem("produtosCacaue")) || [];
    corpoTabelaProdutos.innerHTML = "";

    produtos.forEach((prod, index) => {
      const novaLinha = document.createElement("tr");
      novaLinha.innerHTML = `
        <td>${String(index + 1).padStart(2, "0")}</td>
        <td><img src="${prod.imagem}" alt="Foto" class="miniatura-tabela" /></td>
        <td>${prod.nome}</td>
        <td>${prod.categoria}</td>
        <td>R$ ${prod.preco}</td>
        <td>${prod.quantidade}</td>
        <td>
          <button class="botao-tabela-editar" type="button" data-index="${index}">Editar</button>
          <button class="botao-tabela-excluir" type="button" data-index="${index}">Excluir</button>
        </td>
      `;
      corpoTabelaProdutos.appendChild(novaLinha);
    });
  }

  carregarProdutosTabela();

  if (formProduto) {
    formProduto.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("campo-nome-produto").value;
      const categoria = document.getElementById("campo-categoria").value;
      const precoInput = document.getElementById("campo-preco").value;
      const quantidade = document.getElementById("campo-quantidade").value;
      const inputImagem = document.getElementById("campo-img");

      const precoFormatado = precoInput
        ? parseFloat(precoInput).toFixed(2).replace(".", ",")
        : "0,00";
      const qtdFormatada = quantidade ? quantidade : "0";

      let produtos = JSON.parse(localStorage.getItem("produtosCacaue")) || [];

      const salvarProdutoNaMemoria = (urlImg) => {
        if (linhaProdutoEmEdicao !== null) {
          // Atualiza o produto existente
          produtos[linhaProdutoEmEdicao] = {
            nome,
            categoria,
            preco: precoFormatado,
            quantidade: qtdFormatada,
            imagem: urlImg,
          };
          linhaProdutoEmEdicao = null;
          botaoSalvarProduto.textContent = "Salvar Produto";
          alert("Produto atualizado com sucesso!");
        } else {
          // Adiciona novo produto
          produtos.push({
            nome,
            categoria,
            preco: precoFormatado,
            quantidade: qtdFormatada,
            imagem: urlImg,
          });
          alert("Produto cadastrado com sucesso!");
        }

        localStorage.setItem("produtosCacaue", JSON.stringify(produtos));
        carregarProdutosTabela();
        formProduto.reset();
      };

      if (inputImagem.files && inputImagem.files[0]) {
        const leitor = new FileReader();
        leitor.onload = (ev) => salvarProdutoNaMemoria(ev.target.result);
        leitor.readAsDataURL(inputImagem.files[0]);
      } else if (linhaProdutoEmEdicao !== null) {
        const imgAntiga = produtos[linhaProdutoEmEdicao].imagem;
        salvarProdutoNaMemoria(imgAntiga);
      } else {
        salvarProdutoNaMemoria("./imagens/logo_Cacaue_arvore.png");
      }
    });

    corpoTabelaProdutos.addEventListener("click", (e) => {
      const alvo = e.target;
      const index = alvo.getAttribute("data-index");
      let produtos = JSON.parse(localStorage.getItem("produtosCacaue")) || [];

      if (alvo.classList.contains("botao-tabela-excluir")) {
        if (confirm("Deseja realmente remover este produto?")) {
          produtos.splice(index, 1);
          localStorage.setItem("produtosCacaue", JSON.stringify(produtos));
          carregarProdutosTabela();
        }
      }

      if (alvo.classList.contains("botao-tabela-editar")) {
        linhaProdutoEmEdicao = index;
        const prod = produtos[index];
        document.getElementById("campo-nome-produto").value = prod.nome;
        document.getElementById("campo-categoria").value = prod.categoria;
        document.getElementById("campo-preco").value = prod.preco.replace(
          ",",
          ".",
        );
        document.getElementById("campo-quantidade").value = prod.quantidade;
        botaoSalvarProduto.textContent = "Atualizar Produto";
        document
          .getElementById("secao-formulario-produto")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ================= LÓGICA DE FORNECEDORES =================
  const formFornecedor = document.getElementById("form-fornecedor");
  const corpoTabelaFornecedores = document.querySelector(
    "#tabela-fornecedores tbody",
  );
  const botaoSalvarFornecedor = document.getElementById(
    "botao-salvar-fornecedor",
  );
  let linhaFornecedorEmEdicao = null;

  if (formFornecedor) {
    formFornecedor.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("campo-nome-fornecedor").value;
      const contato = document.getElementById("campo-contato").value;
      const cnpj = document.getElementById("campo-cnpj").value;
      const produtoFornecido = document.getElementById(
        "campo-produto-fornecido",
      ).value;

      const idGerado = linhaFornecedorEmEdicao
        ? linhaFornecedorEmEdicao.children[0].textContent
        : String(corpoTabelaFornecedores.rows.length + 1).padStart(2, "0");

      if (linhaFornecedorEmEdicao) {
        linhaFornecedorEmEdicao.children[1].textContent = nome;
        linhaFornecedorEmEdicao.children[2].textContent = contato;
        linhaFornecedorEmEdicao.children[3].textContent = cnpj;
        linhaFornecedorEmEdicao.children[4].textContent = produtoFornecido;
        linhaFornecedorEmEdicao = null;
        botaoSalvarFornecedor.textContent = "Salvar Fornecedor";
        alert("Fornecedor atualizado com sucesso!");
      } else {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
          <td>${idGerado}</td>
          <td>${nome}</td>
          <td>${contato}</td>
          <td>${cnpj}</td>
          <td>${produtoFornecido}</td>
          <td>
            <button class="botao-tabela-editar" type="button">Editar</button>
            <button class="botao-tabela-excluir" type="button">Excluir</button>
          </td>
        `;
        corpoTabelaFornecedores.appendChild(novaLinha);
        alert("Fornecedor cadastrado com sucesso!");
      }
      formFornecedor.reset();
    });

    corpoTabelaFornecedores.addEventListener("click", (e) => {
      const alvo = e.target;
      if (alvo.classList.contains("botao-tabela-excluir")) {
        if (confirm("Deseja realmente remover este fornecedor?"))
          alvo.closest("tr").remove();
      }
      if (alvo.classList.contains("botao-tabela-editar")) {
        linhaFornecedorEmEdicao = alvo.closest("tr");
        document.getElementById("campo-nome-fornecedor").value =
          linhaFornecedorEmEdicao.children[1].textContent;
        document.getElementById("campo-contato").value =
          linhaFornecedorEmEdicao.children[2].textContent;
        document.getElementById("campo-cnpj").value =
          linhaFornecedorEmEdicao.children[3].textContent;
        document.getElementById("campo-produto-fornecido").value =
          linhaFornecedorEmEdicao.children[4].textContent;
        botaoSalvarFornecedor.textContent = "Atualizar Fornecedor";
        document
          .getElementById("secao-formulario-fornecedor")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
