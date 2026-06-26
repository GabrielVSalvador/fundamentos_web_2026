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
let campoBusca = document.getElementById("busca");
let botaoBuscar = document.getElementById("btnBuscar");
let botaoOrdenar = document.getElementById("ordenar");

// Carrega os eventos do armazenamento local ao iniciar a página
carregarDoLocalStorage();
listarEventos();
calcularEstatisticas();

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

    salvarNoLocalStorage();
});

// Função que exibe a lista de eventos na tela
function listarEventos() {
    // Obtém o elemento da lista de eventos
    let divLista = document.getElementById("listaEventos");
    divLista.innerHTML = "<h2>Eventos Cadastrados</h2>";

    // Itera sobre o array de eventos e adiciona cada evento à lista exibida na tela
    eventos.forEach(function(evento, index) {
        let hoje = new Date();
        let diasRestantes = Math.ceil((evento.data - hoje) / (1000 * 60 * 60 * 24));
        divLista.innerHTML += `
            <div class="item">
                <span>${evento.titulo} - ${evento.local} - ${evento.vagas} vagas - R$ ${evento.preco} - ${evento.data.toLocaleDateString("pt-BR")} - ${(evento.ativo) ? 'Ativo' : 'Inativo'} - ${(diasRestantes < 0) ? 'Evento expirado' : diasRestantes + ' dias restantes'}</span>
                <button onclick="excluirEvento(${index})">Excluir</button>
                <button onclick="cancelarEvento(${index})">Cancelar</button>
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

// Função que exclui um evento do array de eventos com base no índice fornecido usando o método splice, e atualiza a lista de eventos e as estatísticas exibidas na tela
function excluirEvento(index) {
    eventos.splice(index, 1);
    salvarNoLocalStorage();
    listarEventos();
    calcularEstatisticas();
}

// Função que salva o array de eventos no armazenamento local usando o método setItem do localStorage, convertendo o array em uma string JSON com o método JSON.stringify
function salvarNoLocalStorage() {
    localStorage.setItem("eventos", JSON.stringify(eventos));
}

// Função que carrega o array de eventos do armazenamento local usando o método getItem do localStorage, convertendo a string JSON de volta em um array com o método JSON.parse
function carregarDoLocalStorage() {
    let eventosSalvos = localStorage.getItem("eventos");
    if (eventosSalvos) {
        eventos = JSON.parse(eventosSalvos).map(function(evento) {
        evento.data = new Date(evento.data);
        return evento;
        });
    }
}

// Função que cancela um evento, solicitando ao usuário o motivo do cancelamento e atualizando o objeto do evento com a informação fornecida, além de marcar o evento como inativo
function cancelarEvento(index) {
    // Solicita ao usuário o motivo do cancelamento do evento usando o método prompt
    let motivo = prompt("Digite o motivo do cancelamento do evento:");
    // Se o usuário fornecer um motivo, atualiza o objeto do evento com a informação e marca o evento como inativo, além de salvar as alterações no armazenamento local e atualizar a lista de eventos e as estatísticas exibidas na tela
    if (motivo) {
        eventos[index].cancelamento = motivo;
        eventos[index].ativo = false;
        salvarNoLocalStorage();
        listarEventos();
        calcularEstatisticas();
    }
}

// Adiciona um evento de clique ao botão "Buscar"
botaoBuscar.addEventListener("click", function() {
    let termoBusca = campoBusca.value.toLowerCase();
    let eventosFiltrados = eventos.filter(function(evento) {
        return evento.titulo.toLowerCase().includes(termoBusca);
    });
    // Atualiza a lista de eventos exibida na tela com os eventos filtrados
    let divLista = document.getElementById("listaEventos");
    divLista.innerHTML = "<h2>Eventos Cadastrados</h2>";
    if (eventosFiltrados.length === 0) {
        divLista.innerHTML += "<p>Nenhum evento encontrado.</p>";
        return;
    }
    eventosFiltrados.forEach(function(evento, index) {
        let hoje = new Date();
        let diasRestantes = Math.ceil((evento.data - hoje) / (1000 * 60 * 60 * 24));
        divLista.innerHTML += `
            <div class="item">
                <span>${evento.titulo} - ${evento.local} - ${evento.vagas} vagas - R$ ${evento.preco} - ${evento.data.toLocaleDateString("pt-BR")} - ${(evento.ativo) ? 'Ativo' : 'Inativo'} - ${(diasRestantes < 0) ? 'Evento expirado' : diasRestantes + ' dias restantes'}</span>
                <button onclick="excluirEvento(${index})">Excluir</button>
                <button onclick="cancelarEvento(${index})">Cancelar</button>
            </div>
        `;
    });
});

// Adiciona um evento de clique ao botão "Ordenar"
botaoOrdenar.addEventListener("click", function() {
    // Ordena o array de eventos em ordem decrescente pela data usando o método sort
    eventos.sort(function(a, b){
        return a.data - b.data;
    });
    salvarNoLocalStorage();
    // Atualiza a lista de eventos exibida na tela após ordenar
    listarEventos();
});