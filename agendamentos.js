const API = "https://localhost:7067/api";

if (!localStorage.getItem("usuario")) {
    window.location.href = "index.html";
}

document.getElementById("btnSair").addEventListener("click", function() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
});

const form = document.getElementById("formTreino");
const mensagem = document.getElementById("mensagem");

async function carregarAlunos() {
    const resposta = await fetch(`${API}/Aluno`);
    const alunos = await resposta.json();

    const select = document.getElementById("aluno");

    alunos.forEach(aluno => {
        const opcao = document.createElement("option");
        opcao.value = aluno.idAluno;
        opcao.textContent = aluno.nome;
        select.appendChild(opcao);
    });
}

async function carregarTreinos() {
    const resposta = await fetch(`${API}/Treino`);
    const treinos = await resposta.json();

    const tabela = document.getElementById("listaTreinos");
    tabela.innerHTML = "";

    treinos.forEach(treino => {
        const data = treino.dataTreino.substring(0, 10);
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${treino.nomeAluno}</td>
            <td>${treino.nomePersonal}</td>
            <td>${data}</td>
            <td>${treino.horario}</td>
            <td>${treino.duracao} min</td>
            <td>${treino.observacoes || ""}</td>
            <td>
                <button class="editar" onclick="alterarData(${treino.idTreino}, '${data}')">
                    Alterar data
                </button>

                <button class="excluir" onclick="excluirTreino(${treino.idTreino})">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const treino = {
        idAluno: Number(document.getElementById("aluno").value),
        dataTreino: document.getElementById("dataTreino").value,
        horario: document.getElementById("horario").value,
        duracao: Number(document.getElementById("duracao").value),
        observacoes: document.getElementById("observacoes").value
    };

    const resposta = await fetch(`${API}/Treino`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(treino)
    });

    if (resposta.ok) {
        mensagem.textContent = "Agendamento cadastrado com sucesso!";
        mensagem.style.color = "lightgreen";
        form.reset();
        carregarTreinos();
    } else {
        mensagem.textContent = "Não foi possível cadastrar o agendamento.";
        mensagem.style.color = "red";
    }
});

async function alterarData(id, dataAtual) {
    const novaData = prompt("Digite a nova data (AAAA-MM-DD):", dataAtual);

    if (!novaData) return;

    const resposta = await fetch(`${API}/Treino/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            novaData: novaData
        })
    });

    if (resposta.ok) {
        alert("Data alterada com sucesso!");
        carregarTreinos();
    } else {
        alert("Não foi possível alterar a data.");
    }
}

async function excluirTreino(id) {
    if (!confirm("Deseja realmente excluir este agendamento?")) return;

    const resposta = await fetch(`${API}/Treino/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        alert("Agendamento excluído!");
        carregarTreinos();
    } else {
        alert("Não foi possível excluir o agendamento.");
    }
}

carregarAlunos();
carregarTreinos();