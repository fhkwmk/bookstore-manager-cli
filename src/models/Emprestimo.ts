export interface Emprestimo {
    id?: number;
    livro_id: number;
    cliente_id: number;
    data_emprestimo?: Date;
    data_devolucao?: Date | null;
    status?: 'EMPRESTADO' | 'DEVOLVIDO';
    livro_titulo?: string;
    cliente_nome?: string;
}