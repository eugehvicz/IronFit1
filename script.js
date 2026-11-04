
const formLogin = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagem");

formLogin.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("https://localhost:7067/api/Usuario/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
    localStorage.setItem("usuario", JSON.stringify(dados));

    window.location.href = "dashboard.html";
} else {
            mensagem.textContent = "E-mail ou senha incorretos!";
            mensagem.style.color = "red";
        }

    } catch (erro) {
        mensagem.textContent = "Não foi possível conectar ao servidor!";
        mensagem.style.color = "red";
    }
});
