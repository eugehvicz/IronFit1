const API = "https://localhost:7067/api";

const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {
    window.location.href = "index.html";
} else {
    const usuario = JSON.parse(usuarioSalvo);

    document.getElementById("nomeUsuario").textContent = usuario.nome;
}

async function carregarQuantidades() {
    try {
        const respostaAlunos = await fetch(`${API}/Aluno`);
        const alunos = await respostaAlunos.json();

        const respostaPersonais = await fetch(`${API}/Personal`);
        const personais = await respostaPersonais.json();

        const respostaTreinos = await fetch(`${API}/Treino`);
        const treinos = await respostaTreinos.json();

        document.getElementById("totalAlunos").textContent = alunos.length;
        document.getElementById("totalPersonais").textContent = personais.length;
        document.getElementById("totalAgendamentos").textContent = treinos.length;

    } catch (erro) {
        console.log("Erro ao carregar quantidades:", erro);
    }
}

document.getElementById("btnSair").addEventListener("click", function() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
});

carregarQuantidades();