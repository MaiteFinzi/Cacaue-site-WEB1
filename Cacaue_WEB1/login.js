//login para página administrativa

// login para página administrativa
const formularioLogin = document.getElementById("login-form");

if (formularioLogin) {
  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usuarioDigitado = document.getElementById("username").value.trim();
    const senhaDigitada = document.getElementById("password").value.trim();

    // Defina seus dados de acesso aqui
    const usuarioCorreto = "admin";
    const senhaCorreta = "123";

    if (usuarioDigitado === usuarioCorreto && senhaDigitada === senhaCorreta) {
      // Redireciona para a página de administração
      window.location.href = "admin.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
}
