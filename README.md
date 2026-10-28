# 📚 Bookstore Manager CLI

Aplicação back-end executada via terminal (CLI) desenvolvida em **Node.js** e **TypeScript** para o gerenciamento de uma livraria, contemplando o controle de autores, livros, clientes e empréstimos. Projeto desenvolvido como parte do Projeto Final Avaliativo da Formação Desenvolvedor Back-End Node (Turma 04).

---

## 🎯 Objetivo do Projeto
Consolidar os conhecimentos de programação orientada a objetos, arquitetura em camadas, programação assíncrona, modelagem de banco de dados relacional (PostgreSQL) e boas práticas de desenvolvimento (Clean Code e SOLID).

---

## 🛠️ Tecnologias Utilizadas
* **Node.js**[cite: 13]
* **TypeScript**[cite: 13]
* **PostgreSQL** (para o projeto de banco de dados e script DDL/DML/Relatórios)
* **tsx** (execução de arquivos TypeScript)
* **dotenv** (gerenciamento de variáveis de ambiente)
* **pg** (cliente PostgreSQL)

---

## 📂 Arquitetura do Projeto
A aplicação está organizada em camadas para garantir a separação de responsabilidades:
* **`src/main.ts`**: Ponto de entrada da aplicação, responsável por iniciar o sistema e carregar os dados iniciais (`seed`).
* **`src/menus/`**: Organização dos menus interativos exibidos no terminal.
* **`src/controllers/`**: Camada de apresentação responsável por receber as entradas do usuário e acionar os serviços.
* **`src/services/`**: Implementação das regras de negócio e validações.
* **`src/repositories/`**: Gerenciamento do armazenamento e recuperação dos dados em memória durante a execução.
* **`src/models/`**: Definição das classes, interfaces e tipos das entidades.
* **`src/data/`**: Contém os dados iniciais (`seed.ts`).
* **`database/`**: Contém o Diagrama Entidade-Relacionamento (DER) e o arquivo `script.sql` (DDL, DML e consultas relacionais).

---

## ⚙️ Requisitos para Execução
* Node.js instalado na máquina.
* Gerenciador de pacotes `npm`.
* PostgreSQL (caso deseje executar o script de banco de dados).

---

## 🚀 Instalação e Execução

1. Para clonar o projeto corretamente, basta copiar e colar o comando limpo abaixo diretamente no seu terminal:
   git clone https://github.com/fhkwmk/bookstore-manager-cli.git

2. Em seguida, entre na pasta do projeto e instale as dependências:
   cd bookstore-manager-cli
   npm install

