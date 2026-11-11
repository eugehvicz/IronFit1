
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
    select.innerHTML = '<option value="">Selecione um aluno</option>';

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
                    Editar
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
        await carregarTreinos();
    } else {
        mensagem.textContent = "Não foi possível cadastrar o agendamento.";
        mensagem.style.color = "red";
    }
});


function alterarData(id, dataAtual) {
    document.getElementById("editarIdTreino").value = id;
    document.getElementById("editarDataTreino").value = dataAtual;

    document.getElementById("modalEditarTreino").style.display = "flex";
}

window.alterarData = alterarData;

function fecharModalTreino() {
    document.getElementById("modalEditarTreino").style.display = "none";
}

window.fecharModalTreino = fecharModalTreino;


document.getElementById("formEditarTreino").addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("editarIdTreino").value;
    const novaData = document.getElementById("editarDataTreino").value;

    const resposta = await fetch(`${API}/Treino/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            novaData: novaData
        })
    });

    if (resposta.ok) {
        alert("Agendamento atualizado com sucesso!");
        fecharModalTreino();
        await carregarTreinos();
    } else {
        alert("Não foi possível atualizar o agendamento.");
    }
});


async function excluirTreino(id) {
    if (!confirm("Deseja realmente excluir este agendamento?")) return;

    const resposta = await fetch(`${API}/Treino/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        alert("Agendamento excluído!");
        await carregarTreinos();
    } else {
        alert("Não foi possível excluir o agendamento.");
    }
}

window.excluirTreino = excluirTreino;

carregarAlunos();
carregarTreinos();
