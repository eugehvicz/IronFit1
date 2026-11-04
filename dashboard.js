const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {
    window.location.href = "index.html";
} else {
    const usuario = JSON.parse(usuarioSalvo);

    document.getElementById("nomeUsuario").textContent = usuario.nome;
}

const btnSair = document.getElementById("btnSair");

btnSair.addEventListener("click", function() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
});