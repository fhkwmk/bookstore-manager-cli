// Importa a entidade Cliente e os dados iniciais em memória
import { Cliente, type ClienteProps } from '../models/Cliente.js';
import { seedClientes } from '../data/seed.js';

// Repositório em memória responsável por gerenciar os registros de clientes
export class ClienteRepository {
    // Array em memória inicializado com o seed de clientes
    private clientes: Cliente[] = [...seedClientes];

    // Gera o próximo ID numérico disponível
    private gerarProximoId(): number {
        const maiorId = this.clientes.reduce((max, item) => (item.id && item.id > max ? item.id : max), 0);
        return maiorId + 1;
    }

    // Retorna todos os clientes cadastrados em memória
    public async listarTodos(): Promise<Cliente[]> {
        return [...this.clientes];
    }

    // Busca um cliente pelo ID
    public async buscarPorId(id: number): Promise<Cliente | undefined> {
        return this.clientes.find((cliente) => cliente.id === id);
    }

    // Busca um cliente pelo e-mail (útil para evitar duplicidade)
    public async buscarPorEmail(email: string): Promise<Cliente | undefined> {
        const emailNormalizado = email.trim().toLowerCase();
        return this.clientes.find((cliente) => cliente.email.toLowerCase() === emailNormalizado);
    }

    // Cria e armazena um novo cliente em memória
    public async criar(dados: Omit<ClienteProps, 'id'>): Promise<Cliente> {
        const novoCliente = new Cliente({
            id: this.gerarProximoId(),
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
        });
        this.clientes.push(novoCliente);
        return novoCliente;
    }

    // Atualiza os dados de um cliente existente
    public async atualizar(id: number, dados: Partial<Omit<ClienteProps, 'id'>>): Promise<Cliente | undefined> {
        const cliente = this.clientes.find((item) => item.id === id);
        if (!cliente) {
            return undefined;
        }

        if (dados.nome !== undefined) {
            cliente.nome = dados.nome;
        }
        if (dados.email !== undefined) {
            cliente.email = dados.email;
        }
        if (dados.telefone !== undefined) {
            cliente.telefone = dados.telefone;
        }

        return cliente;
    }

    // Remove um cliente pelo ID
    public async remover(id: number): Promise<boolean> {
        const indice = this.clientes.findIndex((item) => item.id === id);
        if (indice === -1) {
            return false;
        }

        this.clientes.splice(indice, 1);
        return true;
    }
}