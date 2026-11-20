// Tipo união que restringe os estados possíveis de um empréstimo
export type StatusEmprestimo = 'EMPRESTADO' | 'DEVOLVIDO';

// Interface que define as propriedades necessárias para criar ou representar um Empréstimo
export interface EmprestimoProps {
    id?: number;
    livro_id: number;
    cliente_id: number;
    data_emprestimo?: Date;
    data_devolucao?: Date | null;
    status?: StatusEmprestimo;
    livro_titulo?: string;
    cliente_nome?: string;
}

// Classe que representa a entidade Emprestimo com valores padrão seguros no construtor
export class Emprestimo {
    public id?: number;
    public livro_id: number;
    public cliente_id: number;
    public data_emprestimo: Date;
    public data_devolucao: Date | null;
    public status: StatusEmprestimo;
    public livro_titulo?: string;
    public cliente_nome?: string;

    constructor(props: EmprestimoProps) {
        if (props.id !== undefined) {
            this.id = props.id;
        }
        this.livro_id = props.livro_id;
        this.cliente_id = props.cliente_id;
        // Define a data atual caso não seja informada
        this.data_emprestimo = props.data_emprestimo ?? new Date();
        // Mantém `null` enquanto o livro ainda não foi devolvido
        this.data_devolucao = props.data_devolucao ?? null;
        // Inicia sempre como 'EMPRESTADO' se nenhum status for passado
        this.status = props.status ?? 'EMPRESTADO';

        if (props.livro_titulo !== undefined) {
            this.livro_titulo = props.livro_titulo;
        }
        if (props.cliente_nome !== undefined) {
            this.cliente_nome = props.cliente_nome;
        }
    }
}