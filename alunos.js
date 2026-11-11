
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

    const selectCadastro = document.getElementById("personal");
    const selectEdicao = document.getElementById("editarPersonal");

    selectCadastro.innerHTML = '<option value="">Selecione um personal</option>';
    selectEdicao.innerHTML = '<option value="">Selecione um personal</option>';

    personais.forEach(personal => {
        const opcaoCadastro = document.createElement("option");
        opcaoCadastro.value = personal.idPersonal;
        opcaoCadastro.textContent = personal.nome;
        selectCadastro.appendChild(opcaoCadastro);

        const opcaoEdicao = document.createElement("option");
        opcaoEdicao.value = personal.idPersonal;
        opcaoEdicao.textContent = personal.nome;
        selectEdicao.appendChild(opcaoEdicao);
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
    const resposta = await fetch(`${API}/Aluno`);
    const alunos = await resposta.json();

    const aluno = alunos.find(a => a.idAluno === id);

    if (!aluno) {
        alert("Aluno não encontrado.");
        return;
    }

    document.getElementById("editarIdAluno").value = aluno.idAluno;
    document.getElementById("editarNome").value = aluno.nome;
    document.getElementById("editarCpf").value = aluno.cpf;
    document.getElementById("editarTelefone").value = aluno.telefone || "";
    document.getElementById("editarEmail").value = aluno.email || "";
    document.getElementById("editarPersonal").value = aluno.idPersonal;

    document.getElementById("modalEditarAluno").style.display = "flex";
}

window.editarAluno = editarAluno;


function fecharModalAluno() {
    document.getElementById("modalEditarAluno").style.display = "none";
}

window.fecharModalAluno = fecharModalAluno;

// SALVAR ALTERAÇÕES
document.getElementById("formEditarAluno").addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("editarIdAluno").value;

    const aluno = {
        nome: document.getElementById("editarNome").value,
        cpf: document.getElementById("editarCpf").value,
        telefone: document.getElementById("editarTelefone").value,
        email: document.getElementById("editarEmail").value,
        idPersonal: Number(document.getElementById("editarPersonal").value)
    };

    const resposta = await fetch(`${API}/Aluno/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
    });

    if (resposta.ok) {
        alert("Aluno atualizado com sucesso!");
        fecharModalAluno();
        await carregarAlunos();
    } else {
        alert("Não foi possível atualizar o aluno.");
    }
});

async function excluirAluno(id) {
    if (!confirm("Deseja realmente excluir este aluno?")) return;

    const resposta = await fetch(`${API}/Aluno/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        alert("Aluno excluído!");
        await carregarAlunos();
    } else {
        alert("Não foi possível excluir. Verifique se há treinos vinculados.");
    }
}

window.excluirAluno = excluirAluno;

carregarPersonais();
carregarAlunos();
