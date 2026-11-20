// Importa a entidade Cliente, seu tipo de dados e os repositórios em memória
import { Cliente, type ClienteProps } from '../models/Cliente.js';
import { ClienteRepository } from '../repositories/ClienteRepository.js';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository.js';

// Serviço responsável pelas regras de negócio e validações de Clientes
export class ClienteService {
    private clienteRepository: ClienteRepository;
    private emprestimoRepository: EmprestimoRepository;

    // Recebe os repositórios via construtor para manter os dados sincronizados em memória
    constructor(clienteRepository: ClienteRepository, emprestimoRepository: EmprestimoRepository) {
        this.clienteRepository = clienteRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    // Lista todos os clientes cadastrados
    async listarClientes(): Promise<Cliente[]> {
        try {
            return await this.clienteRepository.listarTodos();
        } catch (error) {
            throw new Error(`Erro ao listar clientes: ${(error as Error).message}`);
        }
    }

    // Busca um cliente pelo ID ou lança erro se não existir
    async buscarPorId(id: number): Promise<Cliente> {
        try {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID de cliente inválido.');
            }

            const cliente = await this.clienteRepository.buscarPorId(id);
            if (!cliente) {
                throw new Error(`Cliente com ID ${id} não encontrado.`);
            }

            return cliente;
        } catch (error) {
            throw error;
        }
    }

    // Valida dados obrigatórios, formato básico de e-mail e unicidade antes de cadastrar
    async cadastrarCliente(dados: Omit<ClienteProps, 'id'>): Promise<Cliente> {
        try {
            const nome = dados.nome.trim();
            const email = dados.email.trim().toLowerCase();
            const telefone = dados.telefone.trim();

            if (!nome) {
                throw new Error('O nome do cliente não pode estar vazio.');
            }
            if (!email || !email.includes('@')) {
                throw new Error('Informe um e-mail válido para o cliente.');
            }
            if (!telefone) {
                throw new Error('O telefone do cliente não pode estar vazio.');
            }

            const existente = await this.clienteRepository.buscarPorEmail(email);
            if (existente) {
                throw new Error(`Já existe um cliente cadastrado com o e-mail "${email}".`);
            }

            return await this.clienteRepository.criar({ nome, email, telefone });
        } catch (error) {
            throw error;
        }
    }

    // Atualiza informações de um cliente existente
    async atualizarCliente(id: number, dados: Partial<Omit<ClienteProps, 'id'>>): Promise<Cliente> {
        try {
            await this.buscarPorId(id);

            const atualizacoes: Partial<Omit<ClienteProps, 'id'>> = {};

            if (dados.nome !== undefined) {
                const nome = dados.nome.trim();
                if (!nome) {
                    throw new Error('O nome do cliente não pode estar vazio.');
                }
                atualizacoes.nome = nome;
            }

            if (dados.email !== undefined) {
                const email = dados.email.trim().toLowerCase();
                if (!email || !email.includes('@')) {
                    throw new Error('Informe um e-mail válido para o cliente.');
                }
                const duplicado = await this.clienteRepository.buscarPorEmail(email);
                if (duplicado && duplicado.id !== id) {
                    throw new Error(`O e-mail "${email}" já está sendo usado por outro cliente.`);
                }
                atualizacoes.email = email;
            }

            if (dados.telefone !== undefined) {
                const telefone = dados.telefone.trim();
                if (!telefone) {
                    throw new Error('O telefone do cliente não pode estar vazio.');
                }
                atualizacoes.telefone = telefone;
            }

            const atualizado = await this.clienteRepository.atualizar(id, atualizacoes);
            if (!atualizado) {
                throw new Error(`Não foi possível atualizar o cliente com ID ${id}.`);
            }

            return atualizado;
        } catch (error) {
            throw error;
        }
    }

    // Remove um cliente apenas se ele não tiver empréstimos ativos
    async deletarCliente(id: number): Promise<void> {
        try {
            await this.buscarPorId(id);

            const emprestimosAtivos = await this.emprestimoRepository.listarAtivosPorClienteId(id);
            if (emprestimosAtivos.length > 0) {
                throw new Error(
                    `Não é possível remover o cliente pois ele possui ${emprestimosAtivos.length} empréstimo(s) ativo(s).`
                );
            }

            const removido = await this.clienteRepository.remover(id);
            if (!removido) {
                throw new Error(`Não foi possível remover o cliente com ID ${id}.`);
            }
        } catch (error) {
            throw error;
        }
    }
}