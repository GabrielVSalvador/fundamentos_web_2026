// Array que guarda todas as despesas do usuário
let despesas = [];
// Variaveis que guardam os elementos do DOM
let botaoAdicionar = document.getElementById("btnAdicionar");
let campoDescricao = document.getElementById("descricao");
let campoValor = document.getElementById("valor");
// Adiciona um evento de clique ao botão "Adicionar"
botaoAdicionar.addEventListener("click", function() {
    // Pega os valores dos campos de descrição e valor
    let descricao = campoDescricao.value;
    let valor = parseFloat(campoValor.value);
    // Valida se a descrição está vazia ou se o valor não é um número válido
    if (descricao === "") {
        alert("Preencha a descrição!");
        return;
    }

    if (isNaN(valor) || valor <= 0) {
        alert("Digite um valor válido!");
        return;
    }
    // Cria um objeto de despesa com a descrição e o valor
    let novaDespesa = {
        descricao: descricao,
        valor: valor
    };
    // Adiciona a nova despesa ao array de despesas
    despesas.push(novaDespesa);
    // Atualiza a lista de despesas exibida na tela
    exibirDespesas();
    // Atualiza as estatísticas das despesas
    calcularEstatisticas();
    // Limpa os campos após adicionar a despesa
    campoDescricao.value = "";
    campoValor.value = "";
});
// Função que exibe a lista de despesas na tela
function exibirDespesas() {
    // Pega o elemento da div que vai exibir a lista de despesas
    let divLista = document.getElementById("lista");
    divLista.innerHTML = "<h2>Despesas</h2>";
    // Itera sobre o array de despesas e adiciona cada despesa à div
    despesas.forEach(function(despesa, indice) {
    divLista.innerHTML += `
        <div class="item">
            <span>${despesa.descricao} - R$ ${despesa.valor}</span>
            <button onclick="removerDespesa(${indice})">Remover</button>
        </div>
    `;
});
}
// Função que calcula e exibe as estatísticas das despesas
function calcularEstatisticas() {
    // Pega o elemento da div que vai exibir as estatísticas
    let divEstatisticas = document.getElementById("estatisticas");
    // Se não houver despesas, limpa a div de estatísticas e retorna
    if (despesas.length === 0) {
        divEstatisticas.innerHTML = "";
        return;
    }  
    // Cria um array com os valores das despesas usando o método map
    let valores = despesas.map(function(despesa) {
        return despesa.valor;
    });
    // Calcula o total das despesas usando o método reduce
    let total = valores.reduce(function(acumulador, valorAtual) {
    return acumulador + valorAtual;
    }, 0);

    // Calcula a média das despesas dividindo o total pelo número de despesas
    let media = total / despesas.length;
    // Calcula o maior e o menor gasto usando os métodos Math.max e Math.min com o operador spread
    let maiorGasto = Math.max(...valores);
    let menorGasto = Math.min(...valores);
    // Filtra as despesas que são maiores que 100 usando o método filter
    let gastosAcima100 = despesas.filter(function(despesa) {
    return despesa.valor > 100;
    });

    // Calcula a porcentagem de cada despesa em relação ao total usando o método map
    let porcentagens = despesas.map(function(despesa) {
    let porcentagem = (despesa.valor / total) * 100;
    return `${despesa.descricao}: ${porcentagem.toFixed(1)}%`;
    });

    // Atualiza a div de estatísticas com os valores calculados
    divEstatisticas.innerHTML = `
    <h2>Estatísticas</h2>
    <p>Total: R$ ${total.toFixed(2)}</p>
    <p>Média: R$ ${media.toFixed(2)}</p>
    <p>Maior gasto: R$ ${maiorGasto.toFixed(2)}</p>
    <p>Menor gasto: R$ ${menorGasto.toFixed(2)}</p>
    <p>Gastos acima de R$100: ${gastosAcima100.length}</p>
    <h3>Porcentagem por despesa:</h3>
    <div><p>${porcentagens.join("<br>")}</p></div>`;
}
// Função que remove uma despesa do array de despesas pelo índice utilizando o método splice, e atualiza a lista e as estatísticas
function removerDespesa(indice) {
    despesas.splice(indice, 1);
    exibirDespesas();
    calcularEstatisticas();
}