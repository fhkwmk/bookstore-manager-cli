// Importa o serviço de livros
import { LivroService } from '../services/LivroService.js';

// Controller responsável pelas operações da CLI relacionadas a Livros
export class LivroController {
    private livroService: LivroService;

    constructor(livroService: LivroService) {
        this.livroService = livroService;
    }

    // Lista todos os livros com nome do autor e estoque disponível
    async listar(): Promise<void> {
        try {
            const livros = await this.livroService.listarLivros();
            if (livros.length === 0) {
                console.log('\nNenhum livro cadastrado.');
                return;
            }

            console.log('\n--- LISTA DE LIVROS ---');
            for (const livro of livros) {
                const autorLabel = livro.autor_nome ?? `Autor ID ${livro.autor_id}`;
                console.log(
                    `ID: ${livro.id} | Título: ${livro.titulo} | Ano: ${livro.ano_publicacao} | Disponíveis: ${livro.quantidade_disponivel} | Autor: ${autorLabel}`
                );
            }
        } catch (error) {
            console.error(`\nErro ao listar livros: ${(error as Error).message}`);
        }
    }

    // Busca um livro pelo ID
    async buscarPorId(id: number): Promise<void> {
        try {
            const livro = await this.livroService.buscarPorId(id);
            const autorLabel = livro.autor_nome ?? `Autor ID ${livro.autor_id}`;
            console.log('\n--- LIVRO ENCONTRADO ---');
            console.log(
                `ID: ${livro.id} | Título: ${livro.titulo} | Ano: ${livro.ano_publicacao} | Disponíveis: ${livro.quantidade_disponivel} | Autor: ${autorLabel}`
            );
        } catch (error) {
            console.error(`\nErro: ${(error as Error).message}`);
        }
    }

    // Cadastra um novo livro
    async cadastrar(
        titulo: string,
        ano_publicacao: number,
        quantidade_disponivel: number,
        autor_id: number
    ): Promise<void> {
        try {
            const livro = await this.livroService.cadastrarLivro({
                titulo,
                ano_publicacao,
                quantidade_disponivel,
                autor_id,
            });
            console.log(`\nLivro cadastrado com sucesso! (ID: ${livro.id} - "${livro.titulo}")`);
        } catch (error) {
            console.error(`\nErro ao cadastrar livro: ${(error as Error).message}`);
        }
    }

    // Atualiza informações de um livro existente
    async atualizar(
        id: number,
        dados: { titulo?: string; ano_publicacao?: number; quantidade_disponivel?: number; autor_id?: number }
    ): Promise<void> {
        try {
            const atualizado = await this.livroService.atualizarLivro(id, dados);
            console.log(`\nLivro atualizado com sucesso! (ID: ${atualizado.id} - "${atualizado.titulo}")`);
        } catch (error) {
            console.error(`\nErro ao atualizar livro: ${(error as Error).message}`);
        }
    }

    // Remove um livro caso não tenha empréstimos ativos
    async deletar(id: number): Promise<void> {
        try {
            await this.livroService.deletarLivro(id);
            console.log(`\nLivro de ID ${id} removido com sucesso.`);
        } catch (error) {
            console.error(`\nErro ao remover livro: ${(error as Error).message}`);
        }
    }
}