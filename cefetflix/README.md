# Movie Explorer (Cefetflix)

Aplicação web desenvolvida para a disciplina de Desenvolvimento Web, com o objetivo de consumir a OMDb API para pesquisa e análise de filmes, séries e jogos.

## 🚀 Tecnologias Utilizadas
- **HTML5 & CSS3**: Estrutura e estilização (Layout estilo Netflix).
- **JavaScript (ES6+)**: Manipulação de DOM e lógica de programação.
- **Fetch API**: Consumo assíncrono de dados da [OMDb API](https://www.omdbapi.com/).

## 🛠 Funcionalidades
- **Busca**: Consulta de títulos em tempo real via API.
- **Filtros**: Filtragem por tipo (Filmes, Séries, Jogos).
- **Ordenação**: Classificação dos resultados por Ano ou Título.
- **Estatísticas**: Cálculo automático da média de anos e contagem por tipos usando `reduce`.
- **Detalhes**: Exibição de informações completas (Sinopse, Elenco, Nota, etc.) em modal customizado.

## ⚙️ Como rodar o projeto
1. Clone este repositório: `git clone <link-do-seu-repositorio>`
2. Abra o arquivo `index.html` no seu navegador.
3. **Importante**: O projeto utiliza uma API Key. Certifique-se de configurar sua chave da OMDb no arquivo `js/script.js` na constante `API_KEY`.

## 🎓 Conceitos aplicados
Este projeto foi desenvolvido para demonstrar o domínio de:
- `async/await` e `fetch` para requisições assíncronas.
- Métodos de Array de alta ordem: `.map()`, `.filter()`, `.reduce()` e `.sort()`.
- Manipulação dinâmica do DOM.
- Delegação de eventos.

---
Desenvolvido como atividade prática de Desenvolvimento Web.