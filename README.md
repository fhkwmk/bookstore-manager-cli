# 📚 Bookstore Manager CLI

Aplicação back-end executada via terminal (CLI) desenvolvida em **Node.js** e **TypeScript** para o gerenciamento de uma livraria, contemplando o controle de autores, livros, clientes e empréstimos. Projeto desenvolvido como parte do Projeto Final Avaliativo da Formação Desenvolvedor Back-End Node (Turma 04).

---

## 🎯 Objetivo do Projeto
Consolidar os conhecimentos de programação orientada a objetos, arquitetura em camadas, programação assíncrona, modelagem de banco de dados relacional (PostgreSQL) e boas práticas de desenvolvimento (Clean Code e SOLID).

---

## 🛠️ Tecnologias Utilizadas
* **Node.js**
* **TypeScript**
* **PostgreSQL** (para o projeto de banco de dados e script DDL/DML/Relatórios)
* **tsx** (execução de arquivos TypeScript)
* **dotenv** (gerenciamento de variáveis de ambiente)
* **pg** (cliente PostgreSQL)

---

## 📂 Arquitetura do Projeto
A aplicação está organizada em camadas para garantir a separação de responsabilidades:
* **`src/main.ts`**: Ponto de entrada da aplicação, responsável por iniciar o sistema e carregar os dados iniciais.
* **`src/menus/`**: Camada de apresentação e organização dos menus interativos exibidos no terminal.
* **`src/services/`**: Implementação das regras de negócio, validações e tratamento de erros.
* **`src/repositories/`**: Gerenciamento do acesso aos dados no banco de dados.
* **`src/models/`**: Definição das classes, interfaces e tipos das entidades.
* **`src/config/`**: Configuração da conexão com o banco de dados.
* **`database/`**: Contém o Diagrama Entidade-Relacionamento (DER em PDF/Drawio) e o arquivo `script.sql` (DDL, DML e consultas relacionais).

---

## ⚙️ Requisitos para Execução
* Node.js instalado na máquina.
* Gerenciador de pacotes `npm`.
* PostgreSQL instalado e configurado.

---

## 🚀 Instalação e Execução

1. Clonar o repositório e instalar as dependências:

    ```bash
    git clone [https://github.com/fhkwmk/bookstore-manager-cli.git](https://github.com/fhkwmk/bookstore-manager-cli.git)
    cd bookstore-manager-cli
    npm install
    ```

2. Configuração do Banco de Dados PostgreSQL:
   * Antes de executar a aplicação, crie um banco de dados no seu servidor PostgreSQL chamado `bookstore_db`:
     ```sql
     CREATE DATABASE bookstore_db;
     ```
   * Em seguida, conecte-se ao banco `bookstore_db` e execute o script SQL completo localizado na pasta `database/script.sql` (contendo DDL de criação das tabelas, DML de inserção e relatórios).

3. Execução da aplicação:

    ```bash
    npm run dev
    ```