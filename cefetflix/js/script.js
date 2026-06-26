// Substitua pela sua chave da OMDb API
const API_KEY = "253cf1d7"; 

// Array global para armazenar os filmes retornados, conforme exigido no projeto
let filmesBuscados = []; 

// Selecionando os elementos de busca do HTML
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const modal = document.querySelector("#modal");
const modalBody = document.querySelector("#modalBody");
const closeModal = document.querySelector("#closeModal");

// E adicione o evento de fechar, também fora das funções:
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Selecionando o container onde os cards vão aparecer
const catalogo = document.querySelector("#catalogo");

// Função para renderizar a lista de filmes na tela
const renderizarFilmes = (filmesParaRenderizar) => {
    // 1. Limpa o catálogo anterior sempre que for renderizar de novo
    catalogo.innerHTML = "";

    if (filmesParaRenderizar.length === 0) {
        catalogo.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }

    // 2. Usando o map() para iterar o array e gerar o HTML de cada card
    const cardsHTML = filmesParaRenderizar.map(filme => {
        // Tratamento rápido: a OMDb retorna a string "N/A" quando um filme não tem poster
        const urlPoster = filme.Poster !== "N/A" ? filme.Poster : "https://via.placeholder.com/120x180?text=Sem+Poster";

        return `
            <div class="filme" data-id="${filme.imdbID}" style="cursor: pointer;">
                <div class="filme_header">
                    <img src="${urlPoster}" alt="${filme.Title}" class="filme_poster">
                    <div class="filme_nome">
                        <h3>${filme.Title}</h3>
                        <ul><li>${filme.Type.toUpperCase()}</li></ul>
                        <p><strong>Ano:</strong> ${filme.Year}</p>
                    </div>
                </div>
            </div>
        `;
    }).join(""); // O join("") junta todos os itens do array do map em uma única String GIGANTE de HTML

    // 3. Joga o HTML gerado para dentro da div no DOM
    catalogo.innerHTML = cardsHTML;
};

// Função assíncrona para buscar os dados na OMDb API
const buscarFilmes = async () => {
    // Pegando o valor digitado no input
    const query = searchInput.value.trim(); 
    
    // Validação simples
    if (!query) {
        alert("Por favor, digite o nome de um filme ou série!");
        return;
    }

    // Montando a URL de requisição
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;

    try {
        // Fazendo a requisição usando Fetch API + async/await
        const resposta = await fetch(url);
        const dados = await resposta.json();

        // A OMDb retorna Response: "True" quando encontra algo
        if (dados.Response === "True") {
            // Os filmes retornados são salvos em um array
            filmesBuscados = dados.Search; 
            
            // Vamos imprimir no console para testar se a API está funcionando
            console.log("Sucesso! Filmes encontrados:", filmesBuscados);
            
            aplicarFiltrosEOrdenacao();

            // Aqui chamaremos a função de renderizar na tela (próximo passo)
        } else {
            console.error("Erro da API:", dados.Error);
            alert("Nenhum resultado encontrado para essa busca.");
            // Limpa o array se der erro
            filmesBuscados = []; 
        }
    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);
        alert("Ocorreu um erro ao buscar os dados.");
    }
};

// Ao digitar o nome e clicar em buscar, a aplicação faz a requisição
searchBtn.addEventListener("click", buscarFilmes);

// Opcional: Permitir que o usuário aperte "Enter" no input para buscar
searchInput.addEventListener("keypress", (evento) => {
    if (evento.key === "Enter") {
        buscarFilmes();
    }
});

// Selecionando os controles de filtro e ordenação
const typeFilter = document.querySelector("#typeFilter");
const sortSelect = document.querySelector("#sortSelect");

const aplicarFiltrosEOrdenacao = () => {
    // 1. Criamos uma cópia do array original usando o spread operator (...)
    let filmesFiltrados = [...filmesBuscados];

    // 2. Aplicando o filter() para o Tipo
    const tipoSelecionado = typeFilter.value;
    if (tipoSelecionado !== "") {
        // Retorna apenas os filmes onde o Type bate com a opção do select
        filmesFiltrados = filmesFiltrados.filter(filme => filme.Type === tipoSelecionado);
    }

    // 3. Aplicando o sort() para a Ordenação
    const ordemSelecionada = sortSelect.value;
    
    if (ordemSelecionada === "year") {
        // Ordenar por ano (Mais recente -> Mais antigo)
        // O parseInt ajuda a lidar com anos de séries que vêm no formato "2005–2013"
        filmesFiltrados.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        
    } else if (ordemSelecionada === "title") {
        // Ordenar por título (A-Z)
        // localeCompare é a melhor forma de ordenar strings alfabeticamente no JS
        filmesFiltrados.sort((a, b) => a.Title.localeCompare(b.Title));
    }

    // 4. Chamamos a função de renderizar, mas agora passando a nossa lista filtrada/ordenada
    renderizarFilmes(filmesFiltrados);

    // 5. Calculamos as estatísticas baseadas na lista filtrada
    calcularEstatisticas(filmesFiltrados);
};

// Adicionando os escutadores de evento (quando o usuário mudar a opção, a função roda)
typeFilter.addEventListener("change", aplicarFiltrosEOrdenacao);
sortSelect.addEventListener("change", aplicarFiltrosEOrdenacao);

// Selecionando a div onde as estatísticas vão aparecer
const statsContainer = document.querySelector("#statsContainer");

const calcularEstatisticas = (filmesAtuais) => {
    // Se a lista estiver vazia, ocultamos o painel
    if (filmesAtuais.length === 0) {
        statsContainer.style.display = "none";
        return;
    }

    // 1. Quantidade de itens
    const quantidade = filmesAtuais.length;

    // 2. Média de ano usando reduce
    // O reduce vai iterar o array e somar todos os anos no "acumulador"
    const somaAnos = filmesAtuais.reduce((acumulador, filme) => {
        return acumulador + parseInt(filme.Year);
    }, 0); // O 0 é o valor inicial do acumulador
    
    const mediaAnos = Math.round(somaAnos / quantidade);

    // 3. Contagem por tipo usando reduce
    // Desta vez, o acumulador começa como um objeto vazio {}
    const contagemTipos = filmesAtuais.reduce((acumulador, filme) => {
        const tipo = filme.Type;
        // Se o tipo (ex: "movie") já existe no objeto, soma 1. Se não, inicializa com 1.
        acumulador[tipo] = (acumulador[tipo] || 0) + 1;
        return acumulador;
    }, {});

    // Atualizando o HTML
    statsContainer.innerHTML = `
        <h3 style="margin-top: 0;">Estatísticas da Busca</h3>
        <p><strong>Total de resultados:</strong> ${quantidade}</p>
        <p><strong>Média de Lançamento (Ano):</strong> ${mediaAnos}</p>
        <p><strong>Tipologia:</strong> 
            Filmes: ${contagemTipos.movie || 0} | 
            Séries: ${contagemTipos.series || 0} | 
            Jogos: ${contagemTipos.game || 0}
        </p>
    `;
    
    // Exibe a div
    statsContainer.style.display = "block";
};

catalogo.addEventListener("click", async (event) => {
    // Procura o card clicado subindo na árvore do DOM
    const card = event.target.closest(".filme");
    if (!card) return;

    const id = card.dataset.id;
    const urlDetalhe = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;

    try {
        const resposta = await fetch(urlDetalhe);
        const detalhe = await resposta.json();

        // modal para mostrar os detalhes
        try {
        const resposta = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
        const d = await resposta.json();

        // Preenche o conteúdo do modal com os dados da API
        modalBody.innerHTML = `
            <img src="${d.Poster !== 'N/A' ? d.Poster : 'https://via.placeholder.com/200'}" style="width: 150px; float: left; margin-right: 15px;">
            <h2>${d.Title} (${d.Year})</h2>
            <p><strong>Gênero:</strong> ${d.Genre}</p>
            <p><strong>Direção:</strong> ${d.Director}</p>
            <p><strong>Elenco:</strong> ${d.Actors}</p>
            <p><strong>Duração:</strong> ${d.Runtime}</p>
            <p><strong>Nota IMDb:</strong> ${d.imdbRating}</p>
            <p><strong>Sinopse:</strong> ${d.Plot}</p>
        `;
        
        // Exibe o modal mudando o display para flex
        modal.style.display = "flex";
        
    } catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
        alert("Não foi possível carregar os detalhes.");
    }
        
        // DICA: Para tirar nota máxima, cria uma div ou um modal no HTML 
        // para exibir esses dados de forma bonita em vez de um simples alert!
    } catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
    }
});