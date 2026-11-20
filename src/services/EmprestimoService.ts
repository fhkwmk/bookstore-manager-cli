// Importa a entidade Emprestimo e os repositórios envolvidos em empréstimos e devoluções
import { Emprestimo } from '../models/Emprestimo.js';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository.js';
import { LivroRepository } from '../repositories/LivroRepository.js';
import { ClienteRepository } from '../repositories/ClienteRepository.js';

// Serviço responsável pelas regras de empréstimo, devolução e consulta
export class EmprestimoService {
    private emprestimoRepository: EmprestimoRepository;
    private livroRepository: LivroRepository;
    private clienteRepository: ClienteRepository;

    // Recebe os repositórios via construtor para compartilhar o mesmo estado em memória
    constructor(
        emprestimoRepository: EmprestimoRepository,
        livroRepository: LivroRepository,
        clienteRepository: ClienteRepository
    ) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
        this.clienteRepository = clienteRepository;
    }

    // Preenche título do livro e nome do cliente para exibição completa
    private async enriquecerEmprestimo(emprestimo: Emprestimo): Promise<Emprestimo> {
        const livro = await this.livroRepository.buscarPorId(emprestimo.livro_id);
        const cliente = await this.clienteRepository.buscarPorId(emprestimo.cliente_id);

        return new Emprestimo({
            ...(emprestimo.id !== undefined ? { id: emprestimo.id } : {}),
            livro_id: emprestimo.livro_id,
            cliente_id: emprestimo.cliente_id,
            data_emprestimo: emprestimo.data_emprestimo,
            data_devolucao: emprestimo.data_devolucao,
            status: emprestimo.status,
            ...(livro ? { livro_titulo: livro.titulo } : {}),
            ...(cliente ? { cliente_nome: cliente.nome } : {}),
        });
    }

    // Lista todos os empréstimos registrados em memória
    async listarEmprestimos(): Promise<Emprestimo[]> {
        try {
            const emprestimos = await this.emprestimoRepository.listarTodos();
            return await Promise.all(emprestimos.map((item) => this.enriquecerEmprestimo(item)));
        } catch (error) {
            throw new Error(`Erro ao listar empréstimos: ${(error as Error).message}`);
        }
    }

    // Busca um empréstimo específico pelo ID
    async buscarPorId(id: number): Promise<Emprestimo> {
        try {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID de empréstimo inválido.');
            }

            const emprestimo = await this.emprestimoRepository.buscarPorId(id);
            if (!emprestimo) {
                throw new Error(`Empréstimo com ID ${id} não encontrado.`);
            }

            return await this.enriquecerEmprestimo(emprestimo);
        } catch (error) {
            throw error;
        }
    }

    // Realiza um empréstimo validando livro, cliente e estoque disponível
    async realizarEmprestimo(livroId: number, clienteId: number): Promise<Emprestimo> {
        try {
            if (!Number.isInteger(livroId) || livroId <= 0) {
                throw new Error('ID do livro inválido.');
            }
            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                throw new Error('ID do cliente inválido.');
            }

            const livro = await this.livroRepository.buscarPorId(livroId);
            if (!livro) {
                throw new Error('Livro não encontrado.');
            }

            if (livro.quantidade_disponivel <= 0) {
                throw new Error('Não há exemplares disponíveis deste livro para empréstimo.');
            }

            const cliente = await this.clienteRepository.buscarPorId(clienteId);
            if (!cliente) {
                throw new Error('Cliente não encontrado.');
            }

            // Decrementa o estoque disponível do livro em memória
            await this.livroRepository.atualizar(livroId, {
                quantidade_disponivel: livro.quantidade_disponivel - 1,
            });

            const emprestimo = await this.emprestimoRepository.criar({
                livro_id: livroId,
                cliente_id: clienteId,
                data_emprestimo: new Date(),
                data_devolucao: null,
                status: 'EMPRESTADO',
                livro_titulo: livro.titulo,
                cliente_nome: cliente.nome,
            });

            return await this.enriquecerEmprestimo(emprestimo);
        } catch (error) {
            throw error;
        }
    }

    // Registra a devolução de um empréstimo ativo e devolve 1 unidade ao estoque do livro
    async realizarDevolucao(emprestimoId: number): Promise<Emprestimo> {
        try {
            if (!Number.isInteger(emprestimoId) || emprestimoId <= 0) {
                throw new Error('ID do empréstimo inválido.');
            }

            const emprestimo = await this.emprestimoRepository.buscarPorId(emprestimoId);
            if (!emprestimo) {
                throw new Error('Empréstimo não encontrado.');
            }

            if (emprestimo.status === 'DEVOLVIDO') {
                throw new Error('Este empréstimo já foi devolvido anteriormente.');
            }

            const emprestimoAtualizado = await this.emprestimoRepository.atualizar(emprestimoId, {
                status: 'DEVOLVIDO',
                data_devolucao: new Date(),
            });

            if (!emprestimoAtualizado) {
                throw new Error('Não foi possível registrar a devolução.');
            }

            const livro = await this.livroRepository.buscarPorId(emprestimo.livro_id);
            if (livro) {
                await this.livroRepository.atualizar(emprestimo.livro_id, {
                    quantidade_disponivel: livro.quantidade_disponivel + 1,
                });
            }

            return await this.enriquecerEmprestimo(emprestimoAtualizado);
        } catch (error) {
            throw error;
        }
    }
}