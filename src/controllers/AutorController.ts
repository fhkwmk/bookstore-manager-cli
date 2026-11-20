// Importa o serviço de autores para delegar validações e operações em memória
import { AutorService } from '../services/AutorService.js';

// Controller responsável pela entrada/saída de dados de Autores no terminal
export class AutorController {
    private autorService: AutorService;

    constructor(autorService: AutorService) {
        this.autorService = autorService;
    }

    // Lista e exibe todos os autores cadastrados
    async listar(): Promise<void> {
        try {
            const autores = await this.autorService.listarAutores();
            if (autores.length === 0) {
                console.log('\nNenhum autor cadastrado.');
                return;
            }

            console.log('\n--- LISTA DE AUTORES ---');
            for (const autor of autores) {
                console.log(`ID: ${autor.id} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade}`);
            }
        } catch (error) {
            console.error(`\nErro ao listar autores: ${(error as Error).message}`);
        }
    }

    // Busca um autor pelo ID e exibe seus detalhes
    async buscarPorId(id: number): Promise<void> {
        try {
            const autor = await this.autorService.buscarPorId(id);
            console.log('\n--- AUTOR ENCONTRADO ---');
            console.log(`ID: ${autor.id} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade}`);
        } catch (error) {
            console.error(`\nErro: ${(error as Error).message}`);
        }
    }

    // Cadastra um novo autor após validação no service
    async cadastrar(nome: string, nacionalidade: string): Promise<void> {
        try {
            const autor = await this.autorService.cadastrarAutor({ nome, nacionalidade });
            console.log(`\nAutor cadastrado com sucesso! (ID: ${autor.id} - ${autor.nome})`);
        } catch (error) {
            console.error(`\nErro ao cadastrar autor: ${(error as Error).message}`);
        }
    }

    // Atualiza nome e/ou nacionalidade de um autor existente
    async atualizar(id: number, nome?: string, nacionalidade?: string): Promise<void> {
        try {
            const dados: { nome?: string; nacionalidade?: string } = {};
            if (nome !== undefined && nome.trim() !== '') {
                dados.nome = nome;
            }
            if (nacionalidade !== undefined && nacionalidade.trim() !== '') {
                dados.nacionalidade = nacionalidade;
            }

            const atualizado = await this.autorService.atualizarAutor(id, dados);
            console.log(`\nAutor atualizado com sucesso! (ID: ${atualizado.id} - ${atualizado.nome})`);
        } catch (error) {
            console.error(`\nErro ao atualizar autor: ${(error as Error).message}`);
        }
    }

    // Remove um autor caso não haja livros vinculados
    async deletar(id: number): Promise<void> {
        try {
            await this.autorService.deletarAutor(id);
            console.log(`\nAutor de ID ${id} removido com sucesso.`);
        } catch (error) {
            console.error(`\nErro ao remover autor: ${(error as Error).message}`);
        }
    }
}