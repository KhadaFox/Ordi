## 📄 Sumário

  * [Visão Geral]
  * [Funcionalidades]
  * [Arquitetura]
  * [Tecnologias Utilizadas]
  * [Configuração do Ambiente de Desenvolvimento]
      * [Pré-requisitos]
      * [Clonando o Repositório]
      * [Configuração da API Externa (Simulação)]
      * [Configuração do Backend]
      * [Configuração do Frontend]
      * [Executando o Projeto]
  * [Fluxo de Uso]
  * [Estrutura do Projeto]
  * [Contribuição]
  * [Licença]
  * [Contato]

## ✨ Visão Geral

O **Ordi** é um sistema de pedidos digital para estabelecimentos de comércio (restaurantes, bares, lanchonetes) que visa modernizar a experiência do cliente. Os clientes podem escanear um QR Code para acessar o cardápio, fazer seus pedidos diretamente de seus celulares e enviá-los para o sistema interno do estabelecimento, tudo de forma intuitiva e eficiente.

## 🚀 Funcionalidades

  * **Acesso por QR Code:** Clientes escaneiam um QR Code da comanda/mesa que já contém o ID da comanda.
  * **Entrada de Número da Mesa:** Solicita ao cliente apenas o número da mesa, completando as informações necessárias para o pedido.
  * **Visualização de Cardápio:** Exibe o cardápio de produtos dinamicamente, obtido de uma API externa (ou fallback local).
  * **Seleção de Produtos:** Permite adicionar produtos ao carrinho, incluindo a escolha de variantes (se aplicável).
  * **Gerenciamento de Carrinho:** Adicione, remova e ajuste a quantidade de itens no carrinho.
  * **Observações no Pedido:** Possibilidade de adicionar observações específicas para cada item e observações gerais para o pedido.
  * **Envio de Pedido:** Envia o pedido completo para o sistema de gerenciamento do comércio através de um backend adaptador.
  * **Interface Responsiva:** Otimizado para visualização em dispositivos móveis.

## 📐 Arquitetura

O projeto Ordi segue uma arquitetura modular com três camadas principais, garantindo flexibilidade, escalabilidade e manutenibilidade:

1.  **Frontend (Aplicativo Cliente):**

      * Desenvolvido em React, é a interface que os clientes utilizam em seus dispositivos móveis.
      * Responsável pela apresentação do cardápio, gerenciamento do carrinho e coleta de dados do pedido.
      * Comunica-se com o **Backend** via API RESTful.

2.  **Backend (Servidor Adaptador):**

      * Desenvolvido em Node.js com Express e TypeScript.
      * Atua como um intermediário entre o Frontend e a API Externa do Comércio.
      * Responsável por:
          * Receber requisições do Frontend.
          * Adaptar (mapear/transformar) os dados entre o formato do Frontend e o formato da API Externa.
          * Chamar a **API Externa do Comércio** para buscar produtos e enviar pedidos.
          * Tratar erros de comunicação e lógica.

3.  **API Externa do Comércio (Simulada):**

      * Representa o sistema real de gerenciamento do estabelecimento (sistema de comandas, estoque, PDV).
      * Neste projeto, é simulada usando `json-server` para fins de desenvolvimento e teste.
      * Fornece os dados do cardápio e recebe os pedidos.

<!-- end list -->

```mermaid
graph TD
    A[Cliente <br/> (Navegador/Celular)] -->|Acessa URL, Interage com UI| B(Frontend <br/> React.js)
    B -->|Requisições HTTP <br/> (GET /api/products, POST /api/orders)| C(Backend <br/> Node.js/Express)
    C -->|Requisições HTTP <br/> (GET /cardapio, POST /pedidos)| D(API Externa do Comércio <br/> json-server/Real API)
```

## 💻 Tecnologias Utilizadas

  * **Frontend:**
      * [React](https://react.dev/)
      * [Vite](https://vitejs.dev/) (para bundling e dev server)
      * [Tailwind CSS](https://tailwindcss.com/) (para estilização)
      * [Axios](https://axios-http.com/) (para requisições HTTP)
      * [React Router DOM](https://reactrouter.com/en/main) (para roteamento)
  * **Backend:**
      * [Node.js](https://nodejs.org/en)
      * [Express.js](https://expressjs.com/)
      * [TypeScript](https://www.typescriptlang.org/)
      * [Axios](https://axios-http.com/) (para requisições HTTP para a API externa)
      * [dotenv](https://www.npmjs.com/package/dotenv) (para variáveis de ambiente)
  * **Ferramentas de Desenvolvimento/Simulação:**
      * [Git](https://git-scm.com/)
      * [json-server](https://github.com/typicode/json-server) (para simular a API Externa)

## 🛠️ Configuração do Ambiente de Desenvolvimento

Para rodar o projeto Ordi em sua máquina local, siga os passos abaixo. Você precisará de **três terminais** abertos simultaneamente.

### Pré-requisitos

  * [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior recomendada)
  * [npm](https://www.npmjs.com/get-npm) ou [Yarn](https://classic.yarnpkg.com/en/docs/install)
  * [Git](https://git-scm.com/downloads)

### Clonando o Repositório

```bash
git clone https://github.com/KhadaFox/Ordi.git
cd Ordi
```

### Configuração da API Externa (Simulação com `json-server`)

Este passo simula a API do sistema de comandas do comércio.

1.  **Instale o `json-server` globalmente:**

    ```bash
    npm install -g json-server
    # ou
    yarn global add json-server
    ```

2.  **Crie o arquivo `db.json`** na pasta `backend/`. Este arquivo será o "banco de dados" da sua API externa simulada.

    ```json
    // backend/db.json
    {
      "cardapio": [
        {
          "id": "prod-cafe",
          "nome": "Café Expresso",
          "descricao": "Café forte e aromático.",
          "categoria": "Bebidas",
          "subcategoria": "Cafés",
          "url_imagem": "/images/cafe_expresso.webp",
          "preco_unico": 8.00,
          "variantes": []
        },
        {
          "id": "prod-sanduiche",
          "nome": "Sanduíche Natural",
          "descricao": "Pão integral, queijo branco, peito de peru e alface.",
          "categoria": "Comidas",
          "subcategoria": "Lanches",
          "url_imagem": "/images/sanduiche_natural.webp",
          "preco_unico": null,
          "variantes": [
            { "id": "var-sanduiche-frango", "nome": "Frango", "preco": 22.00, "descricao": "Com patê de frango" },
            { "id": "var-sanduiche-vegetariano", "nome": "Vegetariano", "preco": 20.00, "descricao": "Com legumes frescos" }
          ]
        }
        // Adicione mais produtos conforme necessário
      ],
      "pedidos": []
    }
    ```

3.  **Abra o PRIMEIRO TERMINAL**, navegue até a pasta `backend/` e inicie o `json-server`:

    ```bash
    cd backend
    json-server --watch db.json --port 8080
    ```

      * Este terminal exibirá os endpoints disponíveis (ex: `http://localhost:8080/cardapio`, `http://localhost:8080/pedidos`). Deixe-o aberto.

### Configuração do Backend

1.  **Abra o SEGUNDO TERMINAL**, navegue até a pasta `backend/`:
    ```bash
    cd backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Crie um arquivo `.env`** na raiz da pasta `backend/` e adicione as seguintes variáveis:
    ```
    # backend/.env
    PORT=3001
    EXTERNAL_API_URL=http://localhost:8080 # IMPORTANTE: SEM '/api' NO FINAL para json-server
    EXTERNAL_API_KEY=sua_chave_de_autenticacao_aqui # Opcional, se a API externa exigir
    ```
4.  **Inicie o servidor do backend:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
      * Este terminal exibirá a mensagem de que o servidor está rodando (ex: `🚀 Backend server running on port 3001`). Deixe-o aberto.

### Configuração do Frontend

1.  **Abra o TERCEIRO TERMINAL**, navegue até a pasta `frontend/`:
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Crie um arquivo `.env.local`** na raiz da pasta `frontend/` e adicione a seguinte variável:
    ```
    # frontend/.env.local
    VITE_BACKEND_API_URL=http://localhost:3001/api # Este deve apontar para o seu backend
    ```
4.  **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
      * Este terminal exibirá a URL onde o frontend está disponível (ex: `http://localhost:5173`). Deixe-o aberto.

### Executando o Projeto

Com os três terminais rodando (json-server, backend e frontend), abra seu navegador e acesse a URL da tela de entrada da comanda, simulando um QR Code:

```
http://localhost:5173/comanda-entry?comandaId=SEU_ID_DA_COMANDA
```

  * Substitua `SEU_ID_DA_COMANDA` por um ID de sua escolha (ex: `ABCDE123`).

## 🚶 Fluxo de Uso

1.  O cliente escaneia o QR Code (simulado pela URL acima).
2.  A tela `ComandaEntry` é carregada, exibindo o `ID da Comanda` (pré-preenchido e não editável).
3.  O cliente insere o `Número da Mesa` e clica em "Acessar Cardápio".
4.  A tela `Menu` é carregada, exibindo os produtos obtidos da API externa (simulada pelo `json-server`).
5.  O cliente pode navegar pelo cardápio, adicionar produtos ao carrinho, ajustar quantidades e adicionar observações.
6.  Ao finalizar, o cliente envia o pedido, que é processado pelo backend e enviado à API externa.
7.  O sucesso do pedido pode ser verificado no terminal do `json-server` (que mostrará o `POST` para `/pedidos`) e no próprio arquivo `backend/db.json` no array `pedidos`.

## 📂 Estrutura do Projeto

```
Ordi/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Lógica de controle para requisições
│   │   ├── integrations/        # Adaptadores para APIs externas (ex: ComandaAdapter.ts)
│   │   ├── routes/              # Definição das rotas da API
│   │   ├── types/               # Definição de tipos TypeScript
│   │   ├── server.ts            # Ponto de entrada do servidor Express
│   │   └── ...
│   ├── .env.example             # Exemplo de arquivo de variáveis de ambiente
│   ├── db.json                  # Arquivo para simulação do json-server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/                  # Arquivos estáticos (ex: imagens)
│   ├── src/
│   │   ├── assets/              # Imagens e outros recursos
│   │   ├── components/          # Componentes reutilizáveis do React
│   │   ├── pages/               # Páginas principais (Menu, ComandaEntry, etc.)
│   │   ├── services/            # Serviços para comunicação com o backend (api.js)
│   │   ├── App.jsx              # Componente principal da aplicação
│   │   ├── main.jsx             # Ponto de entrada do React
│   │   └── ...
│   ├── .env.local.example       # Exemplo de arquivo de variáveis de ambiente do frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore                   # Arquivos/pastas a serem ignorados pelo Git
├── README.md                    # Este arquivo
└── package.json                 # (Opcional) Se você tiver um monorepo com workspaces
```

## 🤝 Contribuição

Contribuições são bem-vindas\! Sinta-se à vontade para abrir issues para reportar bugs ou sugerir funcionalidades, ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE] para mais detalhes.

## ✉️ Contato

  * **Igor "igoresteves880@outlook.com"**
  * GitHub: [https://github.com/KhadaFox](https://github.com/KhadaFox)

-----

**Dica:** Crie os arquivos `.env.example` e `.env.local.example` em suas respectivas pastas (`backend/` e `frontend/`) contendo as variáveis sem os valores, para que outros desenvolvedores saibam quais variáveis precisam configurar. E lembre-se de adicionar `node_modules/`, `.env`, e `.env.local` ao seu `.gitignore` na raiz do projeto.
