// Importa o serviço de empréstimos
import { EmprestimoService } from '../services/EmprestimoService.js';

// Controller responsável pelas operações de empréstimo, devolução e consulta na CLI
export class EmprestimoController {
    private emprestimoService: EmprestimoService;

    constructor(emprestimoService: EmprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    // Lista todos os empréstimos registrados
    async listar(): Promise<void> {
        try {
            const emprestimos = await this.emprestimoService.listarEmprestimos();
            if (emprestimos.length === 0) {
                console.log('\nNenhum empréstimo registrado.');
                return;
            }

            console.log('\n--- LISTA DE EMPRÉSTIMOS ---');
            for (const emp of emprestimos) {
                const livroLabel = emp.livro_titulo ?? `Livro ID ${emp.livro_id}`;
                const clienteLabel = emp.cliente_nome ?? `Cliente ID ${emp.cliente_id}`;
                const dataEmp = emp.data_emprestimo.toLocaleDateString('pt-BR');
                const dataDev = emp.data_devolucao ? emp.data_devolucao.toLocaleDateString('pt-BR') : 'Pendente';
                console.log(
                    `ID: ${emp.id} | Livro: ${livroLabel} | Cliente: ${clienteLabel} | Status: ${emp.status} | Empréstimo: ${dataEmp} | Devolução: ${dataDev}`
                );
            }
        } catch (error) {
            console.error(`\nErro ao listar empréstimos: ${(error as Error).message}`);
        }
    }

    // Registra um novo empréstimo
    async realizarEmprestimo(livroId: number, clienteId: number): Promise<void> {
        try {
            const emprestimo = await this.emprestimoService.realizarEmprestimo(livroId, clienteId);
            console.log(
                `\nEmpréstimo realizado com sucesso! (ID: ${emprestimo.id} - Livro ID ${emprestimo.livro_id} para Cliente ID ${emprestimo.cliente_id})`
            );
        } catch (error) {
            console.error(`\nErro ao realizar empréstimo: ${(error as Error).message}`);
        }
    }

    // Registra a devolução de um empréstimo
    async realizarDevolucao(emprestimoId: number): Promise<void> {
        try {
            const emprestimo = await this.emprestimoService.realizarDevolucao(emprestimoId);
            console.log(`\nDevolução registrada com sucesso! (Empréstimo ID: ${emprestimo.id} - Status: ${emprestimo.status})`);
        } catch (error) {
            console.error(`\nErro ao registrar devolução: ${(error as Error).message}`);
        }
    }
}