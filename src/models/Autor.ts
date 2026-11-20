// Interface que define as propriedades aceitas ao instanciar ou manipular um Autor
export interface AutorProps {
    id?: number;
    nome: string;
    nacionalidade: string;
}

// Classe que representa a entidade Autor com modificadores de acesso explícitos
export class Autor {
    public id?: number;
    public nome: string;
    public nacionalidade: string;

    constructor(props: AutorProps) {
        // Evita atribuir `undefined` explicitamente quando `exactOptionalPropertyTypes` está ativo
        if (props.id !== undefined) {
            this.id = props.id;
        }
        this.nome = props.nome;
        this.nacionalidade = props.nacionalidade;
    }
}