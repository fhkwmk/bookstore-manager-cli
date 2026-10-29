import { LivroRepository } from '../repositories/LivroRepository.js';
import { type Livro } from '../models/Livro.js';

export class LivroService {
    private livroRepository = new LivroRepository();

    async cadastrarLivro(livro: Livro): Promise<Livro> {
        if (!livro.titulo || livro.titulo.trim() === '') {
            throw new Error('O título do livro não pode estar vazio.');
        }
        if (livro.quantidade_disponivel < 0) {
            throw new Error('A quantidade disponível não pode ser negativa.');
        }
        return await this.livroRepository.criar(livro);
    }

    async listarLivros(): Promise<Livro[]> {
        return await this.livroRepository.listarTodos();
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const livro = await this.livroRepository.buscarPorId(id);
        if (!livro) {
            throw new Error(`Livro com ID ${id} não encontrado.`);
        }
        return livro;
    }

    async atualizarLivro(id: number, dados: Partial<Livro>): Promise<void> {
        await this.buscarPorId(id);
        const atualizado = await this.livroRepository.atualizar(id, dados);
        if (!atualizado) {
            throw new Error(`Não foi possível atualizar o livro com ID ${id}.`);
        }
    }

    async deletarLivro(id: number): Promise<void> {
        try {
            await this.buscarPorId(id);
            const deletado = await this.livroRepository.deletar(id);
            if (!deletado) {
                throw new Error(`Não foi possível remover o livro com ID ${id}.`);
            }
        } catch (error: any) {
            if (error.code === '23503' || error.message?.includes('violates foreign key') || error.message?.includes('RESTRICT')) {
                throw new Error('Não é possível remover este livro pois ele possui empréstimos vinculados no histórico.');
            }
            throw error;
        }
    }
}