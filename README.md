# 📚 Bookstore Manager CLI

Aplicação back-end executada via terminal (CLI) desenvolvida em **Node.js** e **TypeScript** para o gerenciamento de uma livraria, contemplando o controle de autores, livros, clientes e empréstimos. Projeto desenvolvido como parte do Projeto Final Avaliativo da Formação Desenvolvedor Back-End Node (Turma 04).

---

## 🎯 Objetivo do Projeto
Consolidar os conhecimentos de programação orientada a objetos, arquitetura em camadas, programação assíncrona, modelagem de dados, boas práticas de desenvolvimento (Clean Code e SOLID) e execução em memória com carga inicial de dados.

---

## 🛠️ Tecnologias Utilizadas
* **Node.js**
* **TypeScript**
* **Repositórios em memória** com dados iniciais (`seed.ts`) para execução da CLI sem dependência de banco ativo
* **PostgreSQL** (modelagem e artefatos SQL preservados na pasta `database/`)

---

## 📂 Arquitetura do Projeto
A aplicação está organizada em camadas para garantir a separação de responsabilidades:
* **`src/main.ts`**: Ponto de entrada da aplicação, responsável por iniciar o sistema e carregar os dados iniciais.
* **`src/data/seed.ts`**: Dados iniciais em memória para autores, clientes, livros e empréstimos.
* **`src/menus/`**: Camada de apresentação e organização dos menus interativos exibidos no terminal.
* **`src/controllers/`**: Coordenação das interações entre os menus e os serviços.
* **`src/services/`**: Implementação das regras de negócio, validações e tratamento de erros.
* **`src/repositories/`**: Gerenciamento do acesso e manipulação dos dados em memória.
* **`src/models/`**: Definição das classes, interfaces e tipos das entidades.
* **`src/config/`**: Configurações e utilitários auxiliares do projeto.
* **`database/`**: Contém o Diagrama Entidade-Relacionamento (DER em PDF/Drawio) e o arquivo `script.sql` (DDL, DML e consultas relacionais).

---

## ⚙️ Requisitos para Execução
* **Node.js** instalado na máquina (com suporte a TypeScript).
* Gerenciador de pacotes **`npm`**.
* *Nota:* A execução da CLI em memória não exige um servidor PostgreSQL rodando localmente[cite: 16, 19]. Os arquivos de banco continuam disponíveis na pasta `database/` (e a versão anterior baseada em PostgreSQL pode ser consultada na branch de referência correspondente).

---

## 🚀 Instalação e Execução

1. Clonar o repositório e instalar as dependências:

    ```bash
    git clone https://github.com/fhkwmk/bookstore-manager-cli.git
    cd bookstore-manager-cli
    npm install
    ```

2. Verificar a tipagem do TypeScript (opcional):

    ```bash
    npx tsc --noEmit
    ```

3. Compilar e executar a aplicação:

    ```bash
    npm run dev
    ```

    *(Para gerar apenas os arquivos compilados em `dist/`, utilize `npm run build`.)*

---

## 🗄️ Artefatos de Banco de Dados (`database/`)
* O script SQL (`database/script.sql`) e o DER permanecem na pasta `database/` para documentação da modelagem relacional.
* Caso deseje consultar a versão anterior integrada ao PostgreSQL, utilize a branch de backup criada no repositório.