const API = "https://localhost:7067/api";

const usuario = localStorage.getItem("usuario");

if (!usuario) {
    window.location.href = "index.html";
}

document.getElementById("btnSair").addEventListener("click", function() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
});

const form = document.getElementById("formAluno");
const mensagem = document.getElementById("mensagem");

async function carregarPersonais() {
    const resposta = await fetch(`${API}/Personal`);
    const personais = await resposta.json();

    const select = document.getElementById("personal");

    personais.forEach(personal => {
        const opcao = document.createElement("option");
        opcao.value = personal.idPersonal;
        opcao.textContent = personal.nome;
        select.appendChild(opcao);
    });
}

async function carregarAlunos() {
    const resposta = await fetch(`${API}/Aluno`);
    const alunos = await resposta.json();

    const tabela = document.getElementById("listaAlunos");
    tabela.innerHTML = "";

    alunos.forEach(aluno => {
        const linha = document.createElement("tr");

        const personal = aluno.nomePersonal || aluno.personal || "";

        linha.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.telefone || ""}</td>
            <td>${typeof personal === "string" ? personal : personal.nome || ""}</td>
            <td>
                <button class="editar" onclick="editarAluno(${aluno.idAluno})">Editar</button>
                <button class="excluir" onclick="excluirAluno(${aluno.idAluno})">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const aluno = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        idPersonal: Number(document.getElementById("personal").value)
    };

    const resposta = await fetch(`${API}/Aluno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
    });

    if (resposta.ok) {
        mensagem.textContent = "Aluno cadastrado com sucesso!";
        mensagem.style.color = "lightgreen";
        form.reset();
        await carregarAlunos();
    } else {
        mensagem.textContent = "Não foi possível cadastrar o aluno.";
        mensagem.style.color = "red";
    }
});

async function editarAluno(id) {
    const novoNome = prompt("Digite o novo nome do aluno:");

    if (!novoNome) return;

    const respostaLista = await fetch(`${API}/Aluno`);
    const alunos = await respostaLista.json();
    const aluno = alunos.find(a => a.idAluno === id);

    if (!aluno) return;

    const resposta = await fetch(`${API}/Aluno/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: novoNome,
            cpf: aluno.cpf,
            telefone: aluno.telefone,
            email: aluno.email,
            idPersonal: aluno.idPersonal
        })
    });

    if (resposta.ok) {
        alert("Aluno atualizado!");
        carregarAlunos();
    } else {
        alert("Não foi possível editar o aluno.");
    }
}

async function excluirAluno(id) {
    if (!confirm("Deseja realmente excluir este aluno?")) return;

    const resposta = await fetch(`${API}/Aluno/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        alert("Aluno excluído!");
        carregarAlunos();
    } else {
        alert("Não foi possível excluir. Verifique se há treinos vinculados.");
    }
}

carregarPersonais();
carregarAlunos();