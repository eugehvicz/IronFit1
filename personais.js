
const API = "https://localhost:7067/api";

if (!localStorage.getItem("usuario")) {
    window.location.href = "index.html";
}

document.getElementById("btnSair").addEventListener("click", function() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
});

const form = document.getElementById("formPersonal");
const mensagem = document.getElementById("mensagem");

// CARREGAR PERSONAIS
async function carregarPersonais(busca = "") {
    const resposta = await fetch(
        `${API}/Personal?busca=${encodeURIComponent(busca)}`
    );

    const personais = await resposta.json();

    const tabela = document.getElementById("listaPersonais");
    tabela.innerHTML = "";

    personais.forEach(personal => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${personal.nome}</td>
            <td>${personal.telefone || ""}</td>
            <td>${personal.email}</td>
            <td>
                <button class="editar" onclick="editarPersonal(${personal.idPersonal})">
                    Editar
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

// CADASTRAR PERSONAL
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const personal = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value
    };

    const resposta = await fetch(`${API}/Personal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personal)
    });

    if (resposta.ok) {
        mensagem.textContent = "Personal cadastrado com sucesso!";
        mensagem.style.color = "lightgreen";
        form.reset();
        carregarPersonais();
    } else {
        mensagem.textContent = "Não foi possível cadastrar o personal.";
        mensagem.style.color = "red";
    }
});

// ABRIR JANELA DE EDIÇÃO
async function editarPersonal(id) {
    const respostaLista = await fetch(`${API}/Personal`);
    const personais = await respostaLista.json();

    const personal = personais.find(p => p.idPersonal === id);

    if (!personal) {
        alert("Personal não encontrado.");
        return;
    }

    document.getElementById("editarIdPersonal").value = personal.idPersonal;
    document.getElementById("editarNomePersonal").value = personal.nome;
    document.getElementById("editarTelefonePersonal").value = personal.telefone || "";
    document.getElementById("editarEmailPersonal").value = personal.email;

    document.getElementById("modalEditarPersonal").style.display = "flex";
}

window.editarPersonal = editarPersonal;

// FECHAR JANELA
function fecharModalPersonal() {
    document.getElementById("modalEditarPersonal").style.display = "none";
}

window.fecharModalPersonal = fecharModalPersonal;

// SALVAR ALTERAÇÕES
document.getElementById("formEditarPersonal").addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("editarIdPersonal").value;

    const personal = {
        nome: document.getElementById("editarNomePersonal").value,
        telefone: document.getElementById("editarTelefonePersonal").value,
        email: document.getElementById("editarEmailPersonal").value
    };

    const resposta = await fetch(`${API}/Personal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personal)
    });

    if (resposta.ok) {
        alert("Personal atualizado com sucesso!");
        fecharModalPersonal();

        const busca = document.getElementById("busca").value;
        await carregarPersonais(busca);
    } else {
        alert("Não foi possível editar o personal.");
    }
});

// BUSCAR PERSONAIS
document.getElementById("busca").addEventListener("input", function() {
    carregarPersonais(this.value);
});

carregarPersonais();
