// Array que guarda o histórico de consultas
let historico = [];

// Variáveis que guardam os elementos do DOM
let campoCidade = document.getElementById("cidade");
let botaoPesquisar = document.getElementById("btnPesquisar");
let mensagem = document.getElementById("mensagem");


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
});


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
}

function salvarHistorico(data) {
    let consulta = {
        cidade: data.name,
        temperatura: data.main.temp,
        descricao: data.weather[0].description,
        dataConsulta: new Date()
    };
    historico.push(consulta);
}

function exibirHistorico() {
    let listaHistorico = document.getElementById("historico");
    listaHistorico.innerHTML = "";
    historico.forEach(function(consulta) {
        let item = document.createElement("li");
        item.textContent = `${consulta.cidade} - ${consulta.temperatura} °C - ${consulta.descricao} - ${consulta.dataConsulta.toLocaleString()}`;
        listaHistorico.appendChild(item);
    });
}

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