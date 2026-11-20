// Interface que define os dados de um Livro, incluindo campo opcional para nome do autor
export interface LivroProps {
    id?: number;
    titulo: string;
    ano_publicacao: number;
    quantidade_disponivel: number;
    autor_id: number;
    autor_nome?: string;
}

// Classe que representa a entidade Livro vinculada a um autor via `autor_id`
export class Livro {
    public id?: number;
    public titulo: string;
    public ano_publicacao: number;
    public quantidade_disponivel: number;
    public autor_id: number;
    public autor_nome?: string;

    constructor(props: LivroProps) {
        if (props.id !== undefined) {
            this.id = props.id;
        }
        this.titulo = props.titulo;
        this.ano_publicacao = props.ano_publicacao;
        this.quantidade_disponivel = props.quantidade_disponivel;
        this.autor_id = props.autor_id;

        // Preenche o nome do autor apenas quando informado (ex.: consultas combinadas)
        if (props.autor_nome !== undefined) {
            this.autor_nome = props.autor_nome;
        }
    }
}