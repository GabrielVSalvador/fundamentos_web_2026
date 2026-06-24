// ============================================================
// SISTEMA DE CONTROLE FINANCEIRO
// Fundamentos Web 2026
// ============================================================

// -------------------------------------------------------
// CONCEITO 1: ARRAY
// Um array é uma lista que guarda vários valores juntos.
// Aqui guardamos todas as despesas do usuário.
// -------------------------------------------------------
let despesas = [];

// -------------------------------------------------------
// CONCEITO 2: SELETORES DO DOM
// Usamos getElementById para "pegar" elementos do HTML
// e poder ler ou alterar eles pelo JavaScript.
// -------------------------------------------------------
let campDescricao  = document.getElementById("descricao");
let campoValor     = document.getElementById("valor");
let botaoAdicionar = document.getElementById("btnAdicionar");
let divLista       = document.getElementById("lista");
let divEstatisticas = document.getElementById("estatisticas");

// -------------------------------------------------------
// CONCEITO 3: EVENTOS
// addEventListener("click", ...) faz com que o JavaScript
// "ouça" o clique do botão e execute uma função.
// -------------------------------------------------------
botaoAdicionar.addEventListener("click", adicionarDespesa);

// -------------------------------------------------------
// FUNÇÃO: adicionarDespesa
// -------------------------------------------------------
function adicionarDespesa() {

  // CONCEITO 4: LENDO VALORES DO HTML
  // .value pega o que o usuário digitou no campo
  // .trim() remove espaços em branco extras
  let descricao = campDescricao.value.trim();

  // CONCEITO 5: CONVERSÃO DE TIPO
  // O valor digitado sempre vem como TEXT (string).
  // parseFloat() converte para número decimal.
  // Ex: "150.50" (texto) → 150.50 (número)
  let valor = parseFloat(campoValor.value);

  // -------------------------------------------------------
  // CONCEITO 6: VALIDAÇÃO DE DADOS
  // Antes de salvar, verificamos se os dados são válidos.
  // isNaN() = "is Not a Number" → verifica se NÃO é número
  // -------------------------------------------------------
  if (descricao === "") {
    alert("Por favor, preencha a descrição!");
    return; // Para a função aqui se inválido
  }

  if (isNaN(valor) || valor <= 0) {
    alert("Por favor, insira um valor válido e maior que zero!");
    return;
  }

  // -------------------------------------------------------
  // CONCEITO 7: OBJETOS
  // Um objeto guarda dados relacionados juntos, com
  // nome (chave) e valor. Aqui criamos uma despesa.
  // -------------------------------------------------------
  let novaDespesa = {
    descricao: descricao,
    valor: valor
  };

  // -------------------------------------------------------
  // CONCEITO 8: push()
  // Adiciona um item ao final do array.
  // -------------------------------------------------------
  despesas.push(novaDespesa);

  // Limpa os campos após adicionar
  campDescricao.value = "";
  campoValor.value = "";

  // Atualiza a tela
  exibirDespesas();
  calcularEstatisticas();
}

// -------------------------------------------------------
// FUNÇÃO: exibirDespesas
// -------------------------------------------------------
function exibirDespesas() {

  // CONCEITO 9: innerHTML
  // Permite escrever HTML dentro de um elemento da página.
  // Começamos vazio para redesenhar tudo do zero.
  divLista.innerHTML = "<h2>📋 Despesas</h2>";

  // CONCEITO 10: forEach
  // Percorre cada item do array e executa uma ação.
  despesas.forEach(function(despesa, indice) {

    // CONCEITO 11: Template Strings (crase `)
    // Permite misturar texto com variáveis usando ${variavel}
    // toFixed(2) formata o número com 2 casas decimais
    divLista.innerHTML += `
      <div class="item">
        <strong>${despesa.descricao}</strong>
        — R$ ${despesa.valor.toFixed(2)}
      </div>
    `;
  });
}

// -------------------------------------------------------
// FUNÇÃO: calcularEstatisticas
// -------------------------------------------------------
function calcularEstatisticas() {

  // Se não tiver nenhuma despesa, não calcula nada
  if (despesas.length === 0) {
    divEstatisticas.innerHTML = "";
    return;
  }

  // -------------------------------------------------------
  // CONCEITO 12: map()
  // Cria um NOVO array transformando cada item.
  // Aqui extraímos só os valores numéricos.
  // Ex: [{desc:"A", valor:100}, {desc:"B", valor:50}]
  //  →  [100, 50]
  // -------------------------------------------------------
  let valores = despesas.map(function(despesa) {
    return despesa.valor;
  });

  // -------------------------------------------------------
  // CONCEITO 13: reduce()
  // "Reduz" um array a um único valor.
  // Aqui soma todos os valores.
  // acumulador começa em 0 e vai somando cada item.
  // -------------------------------------------------------
  let total = valores.reduce(function(acumulador, valorAtual) {
    return acumulador + valorAtual;
  }, 0);

  // -------------------------------------------------------
  // CONCEITO 14: MÉDIA
  // Soma de todos os valores ÷ quantidade de itens
  // despesas.length = quantidade de despesas
  // -------------------------------------------------------
  let media = total / despesas.length;

  // -------------------------------------------------------
  // CONCEITO 15: Math.max() e Math.min()
  // Encontram o maior e menor número de uma lista.
  // O "..." (spread) expande o array como argumentos separados.
  // Ex: Math.max(...[100, 50, 200]) = Math.max(100, 50, 200) = 200
  // -------------------------------------------------------
  let maiorGasto = Math.max(...valores);
  let menorGasto = Math.min(...valores);

  // -------------------------------------------------------
  // CONCEITO 16: filter()
  // Cria um novo array apenas com itens que passam num teste.
  // Aqui filtramos despesas acima de R$100.
  // -------------------------------------------------------
  let gastosAcima100 = despesas.filter(function(despesa) {
    return despesa.valor > 100;
  });

  // -------------------------------------------------------
  // CONCEITO 17: PORCENTAGEM
  // Fórmula: (valorParte / totalGeral) * 100
  // -------------------------------------------------------
  let listaComPorcentagem = despesas.map(function(despesa) {
    let porcentagem = (despesa.valor / total) * 100;
    // toFixed(1) = 1 casa decimal. Ex: 12.5%
    return `${despesa.descricao}: ${porcentagem.toFixed(1)}%`;
  });

  // -------------------------------------------------------
  // CONCEITO 18: join()
  // Une todos os itens de um array em uma string (texto).
  // Ex: ["A: 50%", "B: 50%"].join("<br>") = "A: 50%<br>B: 50%"
  // -------------------------------------------------------
  let porcentagensHTML = listaComPorcentagem.join("<br>");

  // Exibe todas as estatísticas na tela
  divEstatisticas.innerHTML = `
    <h2>📊 Estatísticas</h2>
    <p>💰 <strong>Total gasto:</strong> R$ ${total.toFixed(2)}</p>
    <p>📈 <strong>Média:</strong> R$ ${media.toFixed(2)}</p>
    <p>⬆️ <strong>Maior gasto:</strong> R$ ${maiorGasto.toFixed(2)}</p>
    <p>⬇️ <strong>Menor gasto:</strong> R$ ${menorGasto.toFixed(2)}</p>
    <p>🔢 <strong>Gastos acima de R$100:</strong> ${gastosAcima100.length}</p>
    <hr>
    <h3>📌 Porcentagem por despesa:</h3>
    <p>${porcentagensHTML}</p>
  `;
}
