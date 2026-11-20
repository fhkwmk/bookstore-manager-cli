// Importa o serviço de clientes para regras de negócio e validações
import { ClienteService } from '../services/ClienteService.js';

// Controller responsável pela interação da CLI com os dados de Clientes
export class ClienteController {
    private clienteService: ClienteService;

    constructor(clienteService: ClienteService) {
        this.clienteService = clienteService;
    }

    // Lista e exibe todos os clientes cadastrados
    async listar(): Promise<void> {
        try {
            const clientes = await this.clienteService.listarClientes();
            if (clientes.length === 0) {
                console.log('\nNenhum cliente cadastrado.');
                return;
            }

            console.log('\n--- LISTA DE CLIENTES ---');
            for (const cliente of clientes) {
                console.log(
                    `ID: ${cliente.id} | Nome: ${cliente.nome} | E-mail: ${cliente.email} | Telefone: ${cliente.telefone}`
                );
            }
        } catch (error) {
            console.error(`\nErro ao listar clientes: ${(error as Error).message}`);
        }
    }

    // Busca um cliente pelo ID
    async buscarPorId(id: number): Promise<void> {
        try {
            const cliente = await this.clienteService.buscarPorId(id);
            console.log('\n--- CLIENTE ENCONTRADO ---');
            console.log(
                `ID: ${cliente.id} | Nome: ${cliente.nome} | E-mail: ${cliente.email} | Telefone: ${cliente.telefone}`
            );
        } catch (error) {
            console.error(`\nErro: ${(error as Error).message}`);
        }
    }

    // Cadastra um novo cliente
    async cadastrar(nome: string, email: string, telefone: string): Promise<void> {
        try {
            const cliente = await this.clienteService.cadastrarCliente({ nome, email, telefone });
            console.log(`\nCliente cadastrado com sucesso! (ID: ${cliente.id} - ${cliente.nome})`);
        } catch (error) {
            console.error(`\nErro ao cadastrar cliente: ${(error as Error).message}`);
        }
    }

    // Atualiza dados de um cliente existente
    async atualizar(id: number, nome?: string, email?: string, telefone?: string): Promise<void> {
        try {
            const dados: { nome?: string; email?: string; telefone?: string } = {};
            if (nome !== undefined && nome.trim() !== '') {
                dados.nome = nome;
            }
            if (email !== undefined && email.trim() !== '') {
                dados.email = email;
            }
            if (telefone !== undefined && telefone.trim() !== '') {
                dados.telefone = telefone;
            }

            const atualizado = await this.clienteService.atualizarCliente(id, dados);
            console.log(`\nCliente atualizado com sucesso! (ID: ${atualizado.id} - ${atualizado.nome})`);
        } catch (error) {
            console.error(`\nErro ao atualizar cliente: ${(error as Error).message}`);
        }
    }

    // Remove um cliente caso não possua empréstimos ativos
    async deletar(id: number): Promise<void> {
        try {
            await this.clienteService.deletarCliente(id);
            console.log(`\nCliente de ID ${id} removido com sucesso.`);
        } catch (error) {
            console.error(`\nErro ao remover cliente: ${(error as Error).message}`);
        }
    }
}