
const API_KEY = "6197381e6ca6de77da237bc2631e3ad0";
// Array que guarda o histórico de consultas
let historico = [];

// Variáveis que guardam os elementos do DOM
let campoCidade = document.getElementById("cidade");
let botaoPesquisar = document.getElementById("btnPesquisar");
let mensagem = document.getElementById("mensagem");

// Variável que guarda o gráfico
let grafico = null;
// Carrega o histórico do armazenamento local ao iniciar a página
carregarDoLocalStorage();

// Adiciona um evento de clique ao botão "Pesquisar"
botaoPesquisar.addEventListener("click", async function() {
    let cidade = campoCidade.value.trim();
    if (cidade === "") {
        mensagem.textContent = "Por favor, insira o nome de uma cidade.";
        return;
    }
    let data = await buscarClima(cidade);
    exibirClima(data);
    salvarHistorico(data);
    exibirHistorico();
    exibirEstatisticas();
    exibirGrafico();
});

// Função para buscar o clima de uma cidade usando a API do OpenWeatherMap
async function buscarClima(cidade) {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Cidade não encontrada");
        }
        let data = await response.json();
        return data;
    } catch(error) {
        mensagem.textContent = error.message;
        throw error;
    }
}

// Função para exibir os dados do clima na tela
function exibirClima(data) {
    let strongNomeCidade = document.getElementById("nomeCidade");
    strongNomeCidade.innerHTML = `${data.name}`;
    let strongTemperatura = document.getElementById("temperatura");
    strongTemperatura.innerHTML = `${data.main.temp} °C`;
    let strongSensacaoTermica = document.getElementById("sensacao");
    strongSensacaoTermica.innerHTML = `${data.main.feels_like} °C`;
    let strongUmidade = document.getElementById("umidade");
    strongUmidade.innerHTML = `${data.main.humidity} %`;
    let strongVento = document.getElementById("vento");
    strongVento.innerHTML = `${data.wind.speed} km/h`;
    let strongDataConsulta = document.getElementById("dataConsulta");
    let dataAtual = new Date();
    strongDataConsulta.innerHTML = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;
    let iconeClima = document.getElementById("icone");
    iconeClima.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">`;
}

// Função para salvar a consulta no histórico
function salvarHistorico(data) {
    let consulta = {
        cidade: data.name,
        temperatura: data.main.temp,
        descricao: data.weather[0].description,
        dataConsulta: new Date()
    };
    historico.push(consulta);
    salvarNoLocalStorage();
}

// Função para exibir o histórico de consultas na tela
function exibirHistorico() {
    let listaHistorico = document.getElementById("historico");
    listaHistorico.innerHTML = "";
    historico.forEach(function(consulta) {
        let item = document.createElement("li");
        item.innerHTML = `<p>${consulta.cidade} - ${consulta.temperatura} °C - ${consulta.descricao} - ${consulta.dataConsulta.toLocaleString()}</p> <button onclick="removerHistorico(${historico.indexOf(consulta)})">Remover</button>`;
        listaHistorico.appendChild(item);
    });
}

// Função para exibir as estatísticas das consultas
function exibirEstatisticas() {
    let totalConsultas = historico.length;
    let somaTemperaturas = historico.reduce((soma, consulta) => soma + consulta.temperatura, 0);
    let mediaTemperaturas = totalConsultas > 0 ? (somaTemperaturas / totalConsultas).toFixed(2) : 0;
    let maiorTemperatura = historico.reduce((max, consulta) => consulta.temperatura > max.temperatura ? consulta : max, { temperatura: -Infinity });
    let cidadeQuente = maiorTemperatura.temperatura !== -Infinity ? maiorTemperatura.cidade : "N/A";
    let strongTotalConsultas = document.getElementById("totalConsultas");
    let strongMediaTemperaturas = document.getElementById("mediaTemp");
    let strongMaiorTemperatura = document.getElementById("cidadeQuente");
    strongTotalConsultas.innerHTML = `${totalConsultas}`;
    strongMediaTemperaturas.innerHTML = `${mediaTemperaturas} °C`;
    strongMaiorTemperatura.innerHTML = `${cidadeQuente}`;
}

// Função para salvar o histórico no armazenamento local
function salvarNoLocalStorage() {
    localStorage.setItem("historico", JSON.stringify(historico));
}

// Função para carregar o histórico do armazenamento local
function carregarDoLocalStorage() {
    let historicoSalvo = localStorage.getItem("historico");
    if (historicoSalvo) {
        historico = JSON.parse(historicoSalvo);
        exibirHistorico();
        exibirEstatisticas();
        exibirGrafico();
    }
}

// Função para remover uma consulta do histórico pelo índice
function removerHistorico(index) {
    historico.splice(index, 1);
    salvarNoLocalStorage();
    exibirHistorico();
    exibirEstatisticas();
    exibirGrafico();
}

// Função para exibir o gráfico das temperaturas das consultas
function exibirGrafico() {
    let canvas = document.getElementById("grafico");
    let ctx = canvas.getContext("2d");

    let labels = historico.map(function(consulta) {
        return consulta.cidade;
    });

    let valores = historico.map(function(consulta) {
        return consulta.temperatura;
    });

    if (grafico !== null) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Temperatura (°C)",
                data: valores
            }]
        }
    });
}