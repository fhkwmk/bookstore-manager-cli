// Importa a entidade Autor e os dados iniciais em memória
import { Autor, type AutorProps } from '../models/Autor.js';
import { seedAutores } from '../data/seed.js';

// Repositório em memória responsável por persistir e consultar autores durante a execução
export class AutorRepository {
    // Array em memória inicializado com uma cópia do seed de autores
    private autores: Autor[] = [...seedAutores];

    // Calcula o próximo ID sequencial com base no maior ID existente
    private gerarProximoId(): number {
        const maiorId = this.autores.reduce((max, item) => (item.id && item.id > max ? item.id : max), 0);
        return maiorId + 1;
    }

    // Lista todos os autores armazenados em memória
    public async listarTodos(): Promise<Autor[]> {
        return [...this.autores];
    }

    // Busca um autor específico pelo seu identificador
    public async buscarPorId(id: number): Promise<Autor | undefined> {
        return this.autores.find((autor) => autor.id === id);
    }

    // Cadastra um novo autor em memória e retorna a instância criada com ID
    public async criar(dados: Omit<AutorProps, 'id'>): Promise<Autor> {
        const novoAutor = new Autor({
            id: this.gerarProximoId(),
            nome: dados.nome,
            nacionalidade: dados.nacionalidade,
        });
        this.autores.push(novoAutor);
        return novoAutor;
    }

    // Atualiza os dados de um autor existente e retorna o registro atualizado
    public async atualizar(id: number, dados: Partial<Omit<AutorProps, 'id'>>): Promise<Autor | undefined> {
        const autor = this.autores.find((item) => item.id === id);
        if (!autor) {
            return undefined;
        }

        if (dados.nome !== undefined) {
            autor.nome = dados.nome;
        }
        if (dados.nacionalidade !== undefined) {
            autor.nacionalidade = dados.nacionalidade;
        }

        return autor;
    }

    // Remove um autor pelo ID e retorna true se removido ou false se não encontrado
    public async remover(id: number): Promise<boolean> {
        const indice = this.autores.findIndex((item) => item.id === id);
        if (indice === -1) {
            return false;
        }

        this.autores.splice(indice, 1);
        return true;
    }
}