import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { Emprestimo } from '../models/Emprestimo';

export class EmprestimoService {
    private emprestimoRepository = new EmprestimoRepository();
    private livroRepository = new LivroRepository();
    private clienteRepository = new ClienteRepository();

    async realizarEmprestimo(livroId: number, clienteId: number): Promise<Emprestimo> {
        // 1. Validar se o livro existe
        const livro = await this.livroRepository.buscarPorId(livroId);
        if (!livro) {
            throw new Error('Livro não encontrado.');
        }

        // 2. Validar se há exemplares disponíveis
        if (livro.quantidade_disponivel <= 0) {
            throw new Error('Não há exemplares disponíveis deste livro para empréstimo.');
        }

        // 3. Validar se o cliente existe
        const cliente = await this.clienteRepository.buscarPorId(clienteId);
        if (!cliente) {
            throw new Error('Cliente não encontrado.');
        }

        // 4. Registrar o empréstimo e decrementar a quantidade do livro
        const emprestimo = await this.emprestimoRepository.registrarEmprestimo(livroId, clienteId);
        await this.livroRepository.atualizarQuantidade(livroId, livro.quantidade_disponivel - 1);

        return emprestimo;
    }

    async realizarDevolucao(emprestimoId: number): Promise<Emprestimo> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(emprestimoId);
        if (!emprestimo) {
            throw new Error('Empréstimo não encontrado.');
        }

        if (emprestimo.status === 'DEVOLVIDO') {
            throw new Error('Este empréstimo já foi devolvido anteriormente.');
        }

        // Registrar devolução
        const emprestimoAtualizado = await this.emprestimoRepository.registrarDevolucao(emprestimoId);
        if (!emprestimoAtualizado) {
            throw new Error('Não foi possível registrar a devolução.');
        }

        // Incrementar a quantidade disponível do livro
        const livro = await this.livroRepository.buscarPorId(emprestimo.livro_id);
        if (livro) {
            await this.livroRepository.atualizarQuantidade(livro.id!, livro.quantidade_disponivel + 1);
        }

        return emprestimoAtualizado;
    }

    async listarEmprestimos(): Promise<Emprestimo[]> {
        return await this.emprestimoRepository.listarTodos();
    }
}