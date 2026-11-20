// Importa a entidade Livro e os dados iniciais em memória
import { Livro, type LivroProps } from '../models/Livro.js';
import { seedLivros } from '../data/seed.js';

// Repositório em memória responsável por armazenar e consultar livros
export class LivroRepository {
    // Array em memória inicializado com o seed de livros
    private livros: Livro[] = [...seedLivros];

    // Gera o próximo ID disponível para um novo livro
    private gerarProximoId(): number {
        const maiorId = this.livros.reduce((max, item) => (item.id && item.id > max ? item.id : max), 0);
        return maiorId + 1;
    }

    // Lista todos os livros em memória
    public async listarTodos(): Promise<Livro[]> {
        return [...this.livros];
    }

    // Busca um livro pelo ID
    public async buscarPorId(id: number): Promise<Livro | undefined> {
        return this.livros.find((livro) => livro.id === id);
    }

    // Lista livros vinculados a um determinado autor
    public async listarPorAutorId(autorId: number): Promise<Livro[]> {
        return this.livros.filter((livro) => livro.autor_id === autorId);
    }

    // Cadastra um novo livro em memória
    public async criar(dados: Omit<LivroProps, 'id'>): Promise<Livro> {
        const novoLivro = new Livro({
            id: this.gerarProximoId(),
            titulo: dados.titulo,
            ano_publicacao: dados.ano_publicacao,
            quantidade_disponivel: dados.quantidade_disponivel,
            autor_id: dados.autor_id,
            ...(dados.autor_nome !== undefined ? { autor_nome: dados.autor_nome } : {}),
        });
        this.livros.push(novoLivro);
        return novoLivro;
    }

    // Atualiza informações de um livro existente
    public async atualizar(id: number, dados: Partial<Omit<LivroProps, 'id'>>): Promise<Livro | undefined> {
        const livro = this.livros.find((item) => item.id === id);
        if (!livro) {
            return undefined;
        }

        if (dados.titulo !== undefined) {
            livro.titulo = dados.titulo;
        }
        if (dados.ano_publicacao !== undefined) {
            livro.ano_publicacao = dados.ano_publicacao;
        }
        if (dados.quantidade_disponivel !== undefined) {
            livro.quantidade_disponivel = dados.quantidade_disponivel;
        }
        if (dados.autor_id !== undefined) {
            livro.autor_id = dados.autor_id;
        }
        if (dados.autor_nome !== undefined) {
            livro.autor_nome = dados.autor_nome;
        }

        return livro;
    }

    // Remove um livro pelo ID
    public async remover(id: number): Promise<boolean> {
        const indice = this.livros.findIndex((item) => item.id === id);
        if (indice === -1) {
            return false;
        }

        this.livros.splice(indice, 1);
        return true;
    }
}