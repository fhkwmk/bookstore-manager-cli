// Importa a entidade Emprestimo e os dados iniciais em memória
import { Emprestimo, type EmprestimoProps } from '../models/Emprestimo.js';
import { seedEmprestimos } from '../data/seed.js';

// Repositório em memória responsável por gerenciar empréstimos e devoluções
export class EmprestimoRepository {
    // Array em memória inicializado com o seed de empréstimos
    private emprestimos: Emprestimo[] = [...seedEmprestimos];

    // Gera o próximo ID disponível para um novo empréstimo
    private gerarProximoId(): number {
        const maiorId = this.emprestimos.reduce((max, item) => (item.id && item.id > max ? item.id : max), 0);
        return maiorId + 1;
    }

    // Lista todos os empréstimos em memória
    public async listarTodos(): Promise<Emprestimo[]> {
        return [...this.emprestimos];
    }

    // Busca um empréstimo pelo ID
    public async buscarPorId(id: number): Promise<Emprestimo | undefined> {
        return this.emprestimos.find((emprestimo) => emprestimo.id === id);
    }

    // Lista empréstimos ativos (ainda não devolvidos) de um cliente específico
    public async listarAtivosPorClienteId(clienteId: number): Promise<Emprestimo[]> {
        return this.emprestimos.filter(
            (emprestimo) => emprestimo.cliente_id === clienteId && emprestimo.status === 'EMPRESTADO'
        );
    }

    // Lista empréstimos vinculados a um livro específico
    public async listarPorLivroId(livroId: number): Promise<Emprestimo[]> {
        return this.emprestimos.filter((emprestimo) => emprestimo.livro_id === livroId);
    }

    // Registra um novo empréstimo em memória
    public async criar(dados: Omit<EmprestimoProps, 'id'>): Promise<Emprestimo> {
        const novoEmprestimo = new Emprestimo({
            id: this.gerarProximoId(),
            livro_id: dados.livro_id,
            cliente_id: dados.cliente_id,
            ...(dados.data_emprestimo !== undefined ? { data_emprestimo: dados.data_emprestimo } : {}),
            ...(dados.data_devolucao !== undefined ? { data_devolucao: dados.data_devolucao } : {}),
            ...(dados.status !== undefined ? { status: dados.status } : {}),
            ...(dados.livro_titulo !== undefined ? { livro_titulo: dados.livro_titulo } : {}),
            ...(dados.cliente_nome !== undefined ? { cliente_nome: dados.cliente_nome } : {}),
        });
        this.emprestimos.push(novoEmprestimo);
        return novoEmprestimo;
    }

    // Atualiza um empréstimo existente (por exemplo, ao registrar devolução)
    public async atualizar(id: number, dados: Partial<Omit<EmprestimoProps, 'id'>>): Promise<Emprestimo | undefined> {
        const emprestimo = this.emprestimos.find((item) => item.id === id);
        if (!emprestimo) {
            return undefined;
        }

        if (dados.data_devolucao !== undefined) {
            emprestimo.data_devolucao = dados.data_devolucao;
        }
        if (dados.status !== undefined) {
            emprestimo.status = dados.status;
        }
        if (dados.livro_titulo !== undefined) {
            emprestimo.livro_titulo = dados.livro_titulo;
        }
        if (dados.cliente_nome !== undefined) {
            emprestimo.cliente_nome = dados.cliente_nome;
        }

        return emprestimo;
    }
}