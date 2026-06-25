// Inicializa o array de eventos
let eventos = [];

// variaveis que guardam os elementos do dom
let botaoCadastrar = document.getElementById("btnCadastrar");
let campoTitulo = document.getElementById("titulo");
let campoLocal = document.getElementById("local");
let campoVagas = document.getElementById("vagas");
let campoPreco = document.getElementById("preco");
let campoData = document.getElementById("data");
let campoAtivo = document.getElementById("ativo");

// Adiciona um evento de clique ao botão "Cadastrar"
botaoCadastrar.addEventListener("click", function() {
    // Valida os campos do formulário antes de criar o objeto evento
    if (campoTitulo.value === "") {
        alert("Preencha o título!");
        return;
    }
    if (campoLocal.value === "") {
        alert("Preencha o local!");
        return;
    }
    if (isNaN(parseInt(campoVagas.value)) || parseInt(campoVagas.value) <= 0) {
        alert("Digite um número válido de vagas!");
        return;
    }
    if (isNaN(parseFloat(campoPreco.value)) || parseFloat(campoPreco.value) < 0) {
        alert("Digite um preço válido!");
        return;
    }
    if (campoData.value === "") {
        alert("Preencha a data!");
        return;
    }

    // Cria um objeto evento com os valores dos campos
    let evento = {
        titulo: campoTitulo.value,
        local: campoLocal.value,
        vagas: parseInt(campoVagas.value),
        preco: parseFloat(campoPreco.value),
        data: new Date(campoData.value+"T00:00:00"),
        ativo: campoAtivo.checked,
        observacao: undefined,
        cancelamento: null
    };

    // Adiciona o evento ao array de eventos
    eventos.push(evento);

    // Atualiza a lista de eventos exibida na tela
    listarEventos();

    // Atualiza as estatísticas dos eventos
    calcularEstatisticas();

    // Limpa os campos do formulário
    campoTitulo.value = "";
    campoLocal.value = "";
    campoVagas.value = "";
    campoPreco.value = "";
    campoData.value = "";
    campoAtivo.checked = false;
});

// Função que exibe a lista de eventos na tela
function listarEventos() {
    // Obtém o elemento da lista de eventos
    let divLista = document.getElementById("listaEventos");
    divLista.innerHTML = "<h2>Eventos Cadastrados</h2>";

    // Itera sobre o array de eventos e adiciona cada evento à lista exibida na tela
    eventos.forEach(function(evento, index) {
        divLista.innerHTML += `
            <div class="item">
                <span>${evento.titulo} - ${evento.local} - ${evento.vagas} vagas - R$ ${evento.preco} - ${evento.data.toLocaleDateString("pt-BR")} - ${(evento.ativo) ? 'Ativo' : 'Inativo'}</span>
            </div>
        `;
    });
}

// Função que calcula e exibe as estatísticas dos eventos
function calcularEstatisticas() {
    // Pega o elemento da div que vai exibir as estatísticas
    let divEstatisticas = document.getElementById("estatisticas");
    // Se não houver eventos cadastrados, limpa a div de estatísticas e retorna
    if (eventos.length === 0) {
        divEstatisticas.innerHTML = "";
        return;
    }
    // Calcula o número de eventos ativos e o total arrecadado com base nos eventos cadastrados
    let eventosAtivos = eventos.filter(evento => evento.ativo).length;
    let totalArrecadado = eventos.reduce((total, evento) => total + (evento.preco * evento.vagas), 0);
    // Atualiza a div de estatísticas com as informações calculadas
    divEstatisticas.innerHTML = `
    <h2>Estatísticas</h2>
    <p>Eventos Ativos: ${eventosAtivos}</p>
    <p>Total Arrecadado: R$ ${totalArrecadado.toFixed(2)}</p>`;
    eventos.forEach(function(evento) {
        divEstatisticas.innerHTML += `
        ${evento.observacao == undefined ? `<p>Evento ${evento.titulo} sem observação</p>` : ''}
        ${evento.cancelamento !== null ? `<p> Evento cancelado.</p><p>Motivo: ${evento.cancelamento} </p>` : ''}
    `;})
}