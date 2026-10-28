import { LivroRepository } from '../repositories/LivroRepository';
import { Livro } from '../models/Livro';

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
        return await this.livroRepository.buscarPorId(id);
    }
}