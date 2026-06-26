let paises = [];
carregarPaises();

// Função para carregar os países da API
async function carregarPaises() {
    let resposta = await fetch("https://countriesnow.space/api/v0.1/countries/info?returns=name,capital,flag");
    let dados = await resposta.json();
    paises = dados.data;
    exibirPaises();
}

// Função para exibir os países na tela
function exibirPaises() {
    let divListaPaises = document.getElementById("listaPaises");
    divListaPaises.innerHTML = "";
    // percorre o array de países e adiciona cada país à div
    paises.forEach(function(pais) {
        divListaPaises.innerHTML += `
            <div class="pais">
                ${(pais.flag === undefined) ? "" : `<img src="${pais.flag}" alt="Bandeira de ${pais.name}">`}
                <span>${pais.name} Capital: ${pais.capital}</span>
            </div>
        `;
    });
}

// função para buscar países pelo nome
campoBusca.addEventListener("input", function() {
    let termoBusca = campoBusca.value.toLowerCase();
    let paisesFiltrados = paises.filter(function(pais) {
        return pais.name.toLowerCase().includes(termoBusca);
    });
    let divListaPaises = document.getElementById("listaPaises");
    if (paisesFiltrados.length === 0) {
        divListaPaises.innerHTML = "<p>Nenhum país encontrado.</p>";
        return;
    }
    divListaPaises.innerHTML = "";
    paisesFiltrados.forEach(function(pais) {
        divListaPaises.innerHTML += `
            <div class="pais">
                ${(pais.flag === undefined) ? "" : `<img src="${pais.flag}" alt="Bandeira de ${pais.name}">`}
                <span>${pais.name} Capital: ${pais.capital}</span>
            </div>
        `;
    });
})

let ordemNomeCrescente = true;
let ordemCapitalCrescente = true;

// Função para ordenar os países por nome
function ordenarPorNome() {
    paises.sort(function(a, b) {
        if (ordemNomeCrescente) {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });
    ordemNomeCrescente = !ordemNomeCrescente;
    exibirPaises();
}

// Função para ordenar os países por capital
function ordenarPorCapital() {
    paises.sort(function(a, b) {
        if (ordemCapitalCrescente) {
            return a.capital.localeCompare(b.capital);
        } else {
            return b.capital.localeCompare(a.capital);
        }
    });
    ordemCapitalCrescente = !ordemCapitalCrescente;
    exibirPaises();
}