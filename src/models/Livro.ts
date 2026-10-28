export interface Livro {
    id?: number;
    titulo: string;
    ano_publicacao: number;
    quantidade_disponivel: number;
    autor_id: number;
    autor_nome?: string; // Para facilitar a exibição em consultas com JOIN
}