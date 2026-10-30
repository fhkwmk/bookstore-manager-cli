-- =========================================================================
-- BOOKSTORE MANAGER CLI - SCRIPT DO BANCO DE DADOS (POSTGRESQL)
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. CRIAÇÃO DA ESTRUTURA (DDL)
-- -------------------------------------------------------------------------

DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

-- Tabela de Autores
CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL
);

-- Tabela de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

-- Tabela de Livros (Vinculada obrigatoriamente a um Autor)
CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano_publicacao INT NOT NULL,
    quantidade_disponivel INT NOT NULL CHECK (quantidade_disponivel >= 0),
    autor_id INT NOT NULL,
    CONSTRAINT fk_livro_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE RESTRICT
);

-- Tabela de Empréstimos (Vinculada a Livro e Cliente)
CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INT NOT NULL,
    cliente_id INT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'EMPRESTADO' CHECK (status IN ('EMPRESTADO', 'DEVOLVIDO')),
    CONSTRAINT fk_emprestimo_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE RESTRICT,
    CONSTRAINT fk_emprestimo_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
);


-- -------------------------------------------------------------------------
-- 2. MANIPULAÇÃO DE DADOS (DML - CARGA INICIAL (SEED), UPDATE E DELETE)
-- -------------------------------------------------------------------------

-- Inserção de Autores (Seed)
INSERT INTO autores (nome, nacionalidade) VALUES
('Machado de Assis', 'Brasileira'),
('Clarice Lispector', 'Brasileira'),
('George Orwell', 'Britânica'),
('J.K. Rowling', 'Britânica');

-- Inserção de Clientes (Seed)
INSERT INTO clientes (nome, email, telefone) VALUES
('Ana Souza', 'ana.souza@email.com', '(48) 99111-2222'),
('Carlos Silva', 'carlos.silva@email.com', '(48) 98222-3333'),
('Mariana Lima', 'mariana.lima@email.com', '(48) 97333-4444');

-- Inserção de Livros (Seed)
INSERT INTO livros (titulo, ano_publicacao, quantidade_disponivel, autor_id) VALUES
('Dom Casmurro', 1899, 3, 1),
('Memórias Póstumas de Brás Cubas', 1881, 2, 1),
('A Hora da Estrela', 1977, 4, 2),
('1984', 1949, 5, 3),
('Harry Potter e a Pedra Filosofal', 1997, 3, 4);

-- Inserção de Empréstimos (Seed)
INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, status) VALUES
(1, 1, CURRENT_DATE - INTERVAL '5 days', 'EMPRESTADO'),
(4, 2, CURRENT_DATE - INTERVAL '2 days', 'EMPRESTADO');

-- Exemplo de Atualização (UPDATE)
UPDATE clientes 
SET telefone = '(48) 99999-0000' 
WHERE email = 'ana.souza@email.com';

-- -------------------------------------------------------------------------
-- 3. CONSULTAS E RELATÓRIOS (QUERIES)
-- -------------------------------------------------------------------------

-- Relatório 1: Livros disponíveis
SELECT id, titulo, ano_publicacao, quantidade_disponivel 
FROM livros 
WHERE quantidade_disponivel > 0;

-- Relatório 2: Livros emprestados (com INNER JOIN)
SELECT e.id AS emprestimo_id, l.titulo AS livro, c.nome AS cliente, e.data_emprestimo, e.status
FROM emprestimos e
INNER JOIN livros l ON e.livro_id = l.id
INNER JOIN clientes c ON e.cliente_id = c.id
WHERE e.status = 'EMPRESTADO';

-- Relatório 3: Livros cadastrados por autor (com JOIN, GROUP BY e agregação)
SELECT a.nome AS autor, COUNT(l.id) AS total_livros
FROM autores a
LEFT JOIN livros l ON a.id = l.autor_id
GROUP BY a.nome
ORDER BY total_livros DESC;

-- Relatório 4: Quantidade de empréstimos por livro
SELECT l.titulo, COUNT(e.id) AS total_emprestimos
FROM livros l
LEFT JOIN emprestimos e ON l.id = e.livro_id
GROUP BY l.titulo
ORDER BY total_emprestimos DESC;

-- Relatório 5: Clientes com empréstimos ativos
SELECT DISTINCT c.id, c.nome, c.email
FROM clientes c
INNER JOIN emprestimos e ON c.id = e.cliente_id
WHERE e.status = 'EMPRESTADO';