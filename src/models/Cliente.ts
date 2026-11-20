// Interface que define as propriedades aceitas ao instanciar ou manipular um Cliente
export interface ClienteProps {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
}

// Classe que representa a entidade Cliente no sistema da livraria
export class Cliente {
    public id?: number;
    public nome: string;
    public email: string;
    public telefone: string;

    constructor(props: ClienteProps) {
        // Evita atribuir `undefined` explicitamente quando `exactOptionalPropertyTypes` está ativo
        if (props.id !== undefined) {
            this.id = props.id;
        }
        this.nome = props.nome;
        this.email = props.email;
        this.telefone = props.telefone;
    }
}