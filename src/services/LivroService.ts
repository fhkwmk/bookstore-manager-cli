// Importa a entidade Livro, seu tipo de dados e os repositórios necessários
import { Livro, type LivroProps } from '../models/Livro.js';
import { LivroRepository } from '../repositories/LivroRepository.js';
import { AutorRepository } from '../repositories/AutorRepository.js';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository.js';

// Serviço responsável pelas regras de negócio e validações de Livros
export class LivroService {
    private livroRepository: LivroRepository;
    private autorRepository: AutorRepository;
    private emprestimoRepository: EmprestimoRepository;

    // Recebe os repositórios via construtor para operar sobre o mesmo estado em memória
    constructor(
        livroRepository: LivroRepository,
        autorRepository: AutorRepository,
        emprestimoRepository: EmprestimoRepository
    ) {
        this.livroRepository = livroRepository;
        this.autorRepository = autorRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    // Anexa o nome do autor ao livro para facilitar a exibição na CLI
    private async enriquecerLivro(livro: Livro): Promise<Livro> {
        const autor = await this.autorRepository.buscarPorId(livro.autor_id);
        return new Livro({
            ...(livro.id !== undefined ? { id: livro.id } : {}),
            titulo: livro.titulo,
            ano_publicacao: livro.ano_publicacao,
            quantidade_disponivel: livro.quantidade_disponivel,
            autor_id: livro.autor_id,
            ...(autor ? { autor_nome: autor.nome } : {}),
        });
    }

    // Lista todos os livros com o nome do autor associado
    async listarLivros(): Promise<Livro[]> {
        try {
            const livros = await this.livroRepository.listarTodos();
            return await Promise.all(livros.map((livro) => this.enriquecerLivro(livro)));
        } catch (error) {
            throw new Error(`Erro ao listar livros: ${(error as Error).message}`);
        }
    }

    // Busca um livro pelo ID ou lança erro se não encontrado
    async buscarPorId(id: number): Promise<Livro> {
        try {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID de livro inválido.');
            }

            const livro = await this.livroRepository.buscarPorId(id);
            if (!livro) {
                throw new Error(`Livro com ID ${id} não encontrado.`);
            }

            return await this.enriquecerLivro(livro);
        } catch (error) {
            throw error;
        }
    }

    // Valida título, ano, quantidade e existência do autor antes de cadastrar o livro
    async cadastrarLivro(dados: Omit<LivroProps, 'id' | 'autor_nome'>): Promise<Livro> {
        try {
            const titulo = dados.titulo.trim();
            const anoAtual = new Date().getFullYear();

            if (!titulo) {
                throw new Error('O título do livro não pode estar vazio.');
            }
            if (!Number.isInteger(dados.ano_publicacao) || dados.ano_publicacao <= 0 || dados.ano_publicacao > anoAtual) {
                throw new Error(`Ano de publicação inválido (informe um ano entre 1 e ${anoAtual}).`);
            }
            if (!Number.isInteger(dados.quantidade_disponivel) || dados.quantidade_disponivel < 0) {
                throw new Error('A quantidade disponível não pode ser negativa.');
            }

            const autor = await this.autorRepository.buscarPorId(dados.autor_id);
            if (!autor) {
                throw new Error(`Autor com ID ${dados.autor_id} não encontrado.`);
            }

            const criado = await this.livroRepository.criar({
                titulo,
                ano_publicacao: dados.ano_publicacao,
                quantidade_disponivel: dados.quantidade_disponivel,
                autor_id: dados.autor_id,
                autor_nome: autor.nome,
            });

            return await this.enriquecerLivro(criado);
        } catch (error) {
            throw error;
        }
    }

    // Atualiza campos válidos de um livro existente
    async atualizarLivro(id: number, dados: Partial<Omit<LivroProps, 'id' | 'autor_nome'>>): Promise<Livro> {
        try {
            await this.buscarPorId(id);

            const atualizacoes: Partial<Omit<LivroProps, 'id'>> = {};
            const anoAtual = new Date().getFullYear();

            if (dados.titulo !== undefined) {
                const titulo = dados.titulo.trim();
                if (!titulo) {
                    throw new Error('O título do livro não pode estar vazio.');
                }
                atualizacoes.titulo = titulo;
            }

            if (dados.ano_publicacao !== undefined) {
                if (!Number.isInteger(dados.ano_publicacao) || dados.ano_publicacao <= 0 || dados.ano_publicacao > anoAtual) {
                    throw new Error(`Ano de publicação inválido (informe um ano entre 1 e ${anoAtual}).`);
                }
                atualizacoes.ano_publicacao = dados.ano_publicacao;
            }

            if (dados.quantidade_disponivel !== undefined) {
                if (!Number.isInteger(dados.quantidade_disponivel) || dados.quantidade_disponivel < 0) {
                    throw new Error('A quantidade disponível não pode ser negativa.');
                }
                atualizacoes.quantidade_disponivel = dados.quantidade_disponivel;
            }

            if (dados.autor_id !== undefined) {
                const autor = await this.autorRepository.buscarPorId(dados.autor_id);
                if (!autor) {
                    throw new Error(`Autor com ID ${dados.autor_id} não encontrado.`);
                }
                atualizacoes.autor_id = dados.autor_id;
                atualizacoes.autor_nome = autor.nome;
            }

            const atualizado = await this.livroRepository.atualizar(id, atualizacoes);
            if (!atualizado) {
                throw new Error(`Não foi possível atualizar o livro com ID ${id}.`);
            }

            return await this.enriquecerLivro(atualizado);
        } catch (error) {
            throw error;
        }
    }

    // Remove um livro apenas se ele não tiver empréstimos ativos
    async deletarLivro(id: number): Promise<void> {
        try {
            await this.buscarPorId(id);

            const emprestimos = await this.emprestimoRepository.listarPorLivroId(id);
            const temEmprestimoAtivo = emprestimos.some((emp) => emp.status === 'EMPRESTADO');
            if (temEmprestimoAtivo) {
                throw new Error('Não é possível remover este livro pois ele possui empréstimo ativo.');
            }

            const removido = await this.livroRepository.remover(id);
            if (!removido) {
                throw new Error(`Não foi possível remover o livro com ID ${id}.`);
            }
        } catch (error) {
            throw error;
        }
    }
}