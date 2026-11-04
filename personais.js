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
            <td>${personal.cref}</td>
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

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const personal = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        cref: document.getElementById("cref").value,
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

async function editarPersonal(id) {
    const respostaLista = await fetch(`${API}/Personal`);
    const personais = await respostaLista.json();
    const personal = personais.find(p => p.idPersonal === id);

    if (!personal) return;

    const nome = prompt("Nome:", personal.nome);
    if (nome === null) return;

    const cref = prompt("CREF:", personal.cref);
    if (cref === null) return;

    const telefone = prompt("Telefone:", personal.telefone || "");
    if (telefone === null) return;

    const email = prompt("E-mail:", personal.email);
    if (email === null) return;

    const resposta = await fetch(`${API}/Personal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: nome,
            cref: cref,
            telefone: telefone,
            email: email
        })
    });

    if (resposta.ok) {
        alert("Personal atualizado com sucesso!");
        carregarPersonais();
    } else {
        alert("Não foi possível editar o personal.");
    }
}

document.getElementById("busca").addEventListener("input", function() {
    carregarPersonais(this.value);
});

carregarPersonais();