// Importações com extensão `.js` para compatibilidade com `"module": "nodenext"` no TypeScript
import { Autor } from '../models/Autor.js';
import { Cliente } from '../models/Cliente.js';
import { Livro } from '../models/Livro.js';
import { Emprestimo } from '../models/Emprestimo.js';

// Carga inicial de autores espelhando os registros iniciais do banco
export const seedAutores: Autor[] = [
    new Autor({ id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' }),
    new Autor({ id: 2, nome: 'Clarice Lispector', nacionalidade: 'Brasileira' }),
    new Autor({ id: 3, nome: 'George Orwell', nacionalidade: 'Britânica' }),
    new Autor({ id: 4, nome: 'J.K. Rowling', nacionalidade: 'Britânica' }),
];

// Carga inicial de clientes para popular a memória na inicialização da CLI
export const seedClientes: Cliente[] = [
    new Cliente({ id: 1, nome: 'Ana Souza', email: 'ana.souza@email.com', telefone: '(48) 99999-0000' }),
    new Cliente({ id: 2, nome: 'Carlos Silva', email: 'carlos.silva@email.com', telefone: '(48) 98222-3333' }),
    new Cliente({ id: 3, nome: 'Mariana Lima', email: 'mariana.lima@email.com', telefone: '(48) 97333-4444' }),
];

// Carga inicial de livros vinculados aos respectivos `autor_id`
export const seedLivros: Livro[] = [
    new Livro({ id: 1, titulo: 'Dom Casmurro', ano_publicacao: 1899, quantidade_disponivel: 3, autor_id: 1 }),
    new Livro({ id: 2, titulo: 'Memórias Póstumas de Brás Cubas', ano_publicacao: 1881, quantidade_disponivel: 2, autor_id: 1 }),
    new Livro({ id: 3, titulo: 'A Hora da Estrela', ano_publicacao: 1977, quantidade_disponivel: 4, autor_id: 2 }),
    new Livro({ id: 4, titulo: '1984', ano_publicacao: 1949, quantidade_disponivel: 5, autor_id: 3 }),
    new Livro({ id: 5, titulo: 'Harry Potter e a Pedra Filosofal', ano_publicacao: 1997, quantidade_disponivel: 3, autor_id: 4 }),
];

// Datas retroativas para representar empréstimos já em andamento na carga inicial
const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
const doisDiasAtras = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

// Carga inicial de empréstimos vinculados a livros e clientes
export const seedEmprestimos: Emprestimo[] = [
    new Emprestimo({
        id: 1,
        livro_id: 1,
        cliente_id: 1,
        data_emprestimo: cincoDiasAtras,
        data_devolucao: null,
        status: 'EMPRESTADO',
    }),
    new Emprestimo({
        id: 2,
        livro_id: 4,
        cliente_id: 2,
        data_emprestimo: doisDiasAtras,
        data_devolucao: null,
        status: 'EMPRESTADO',
    }),
];