// Importa a entidade Autor, seu tipo de dados e os repositórios em memória
import { Autor, type AutorProps } from '../models/Autor.js';
import { AutorRepository } from '../repositories/AutorRepository.js';
import { LivroRepository } from '../repositories/LivroRepository.js';

// Serviço responsável pelas regras de negócio e validações de Autores
export class AutorService {
    private autorRepository: AutorRepository;
    private livroRepository: LivroRepository;

    // Recebe os repositórios por injeção para compartilhar o mesmo estado em memória
    constructor(autorRepository: AutorRepository, livroRepository: LivroRepository) {
        this.autorRepository = autorRepository;
        this.livroRepository = livroRepository;
    }

    // Lista todos os autores cadastrados
    async listarAutores(): Promise<Autor[]> {
        try {
            return await this.autorRepository.listarTodos();
        } catch (error) {
            throw new Error(`Erro ao listar autores: ${(error as Error).message}`);
        }
    }

    // Busca um autor pelo ID; lança erro se o ID for inválido ou não encontrado
    async buscarPorId(id: number): Promise<Autor> {
        try {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID de autor inválido.');
            }

            const autor = await this.autorRepository.buscarPorId(id);
            if (!autor) {
                throw new Error(`Autor com ID ${id} não encontrado.`);
            }

            return autor;
        } catch (error) {
            throw error;
        }
    }

    // Valida os campos e cadastra um novo autor em memória
    async cadastrarAutor(dados: Omit<AutorProps, 'id'>): Promise<Autor> {
        try {
            const nome = dados.nome.trim();
            const nacionalidade = dados.nacionalidade.trim();

            if (!nome) {
                throw new Error('O nome do autor não pode estar vazio.');
            }
            if (!nacionalidade) {
                throw new Error('A nacionalidade do autor não pode estar vazia.');
            }

            return await this.autorRepository.criar({ nome, nacionalidade });
        } catch (error) {
            throw error;
        }
    }

    // Atualiza os dados de um autor existente
    async atualizarAutor(id: number, dados: Partial<Omit<AutorProps, 'id'>>): Promise<Autor> {
        try {
            await this.buscarPorId(id);

            const atualizacoes: Partial<Omit<AutorProps, 'id'>> = {};

            if (dados.nome !== undefined) {
                const nome = dados.nome.trim();
                if (!nome) {
                    throw new Error('O nome do autor não pode estar vazio.');
                }
                atualizacoes.nome = nome;
            }

            if (dados.nacionalidade !== undefined) {
                const nacionalidade = dados.nacionalidade.trim();
                if (!nacionalidade) {
                    throw new Error('A nacionalidade do autor não pode estar vazia.');
                }
                atualizacoes.nacionalidade = nacionalidade;
            }

            const atualizado = await this.autorRepository.atualizar(id, atualizacoes);
            if (!atualizado) {
                throw new Error(`Não foi possível atualizar o autor com ID ${id}.`);
            }

            return atualizado;
        } catch (error) {
            throw error;
        }
    }

    // Remove um autor apenas se não houver livros vinculados a ele
    async deletarAutor(id: number): Promise<void> {
        try {
            await this.buscarPorId(id);

            const livrosDoAutor = await this.livroRepository.listarPorAutorId(id);
            if (livrosDoAutor.length > 0) {
                throw new Error(
                    `Não é possível remover o autor pois existem ${livrosDoAutor.length} livro(s) vinculado(s) a ele.`
                );
            }

            const removido = await this.autorRepository.remover(id);
            if (!removido) {
                throw new Error(`Não foi possível remover o autor com ID ${id}.`);
            }
        } catch (error) {
            throw error;
        }
    }
}