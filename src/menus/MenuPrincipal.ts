// Interface readline assíncrona nativa do Node para leitura de entradas no terminal
import type { Interface } from 'node:readline/promises';
import { AutorController } from '../controllers/AutorController.js';
import { ClienteController } from '../controllers/ClienteController.js';
import { LivroController } from '../controllers/LivroController.js';
import { EmprestimoController } from '../controllers/EmprestimoController.js';

// Helper para ler um número inteiro do terminal de forma segura
async function perguntarInteiro(rl: Interface, mensagem: string): Promise<number> {
    const resposta = await rl.question(mensagem);
    return Number(resposta.trim());
}

// Submenu de Autores
async function menuAutores(rl: Interface, autorController: AutorController): Promise<void> {
    let voltar = false;
    while (!voltar) {
        console.log('\n=== MENU AUTORES ===');
        console.log('1 - Listar autores');
        console.log('2 - Buscar autor por ID');
        console.log('3 - Cadastrar autor');
        console.log('4 - Atualizar autor');
        console.log('5 - Remover autor');
        console.log('0 - Voltar ao menu principal');

        const opcao = (await rl.question('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await autorController.listar();
                break;
            case '2': {
                const id = await perguntarInteiro(rl, 'Informe o ID do autor: ');
                await autorController.buscarPorId(id);
                break;
            }
            case '3': {
                const nome = await rl.question('Nome do autor: ');
                const nacionalidade = await rl.question('Nacionalidade: ');
                await autorController.cadastrar(nome, nacionalidade);
                break;
            }
            case '4': {
                const id = await perguntarInteiro(rl, 'ID do autor a atualizar: ');
                const nome = await rl.question('Novo nome (ou Enter para manter): ');
                const nacionalidade = await rl.question('Nova nacionalidade (ou Enter para manter): ');
                await autorController.atualizar(id, nome, nacionalidade);
                break;
            }
            case '5': {
                const id = await perguntarInteiro(rl, 'ID do autor a remover: ');
                await autorController.deletar(id);
                break;
            }
            case '0':
                voltar = true;
                break;
            default:
                console.log('\nOpção inválida.');
        }
    }
}

// Submenu de Clientes
async function menuClientes(rl: Interface, clienteController: ClienteController): Promise<void> {
    let voltar = false;
    while (!voltar) {
        console.log('\n=== MENU CLIENTES ===');
        console.log('1 - Listar clientes');
        console.log('2 - Buscar cliente por ID');
        console.log('3 - Cadastrar cliente');
        console.log('4 - Atualizar cliente');
        console.log('5 - Remover cliente');
        console.log('0 - Voltar ao menu principal');

        const opcao = (await rl.question('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await clienteController.listar();
                break;
            case '2': {
                const id = await perguntarInteiro(rl, 'Informe o ID do cliente: ');
                await clienteController.buscarPorId(id);
                break;
            }
            case '3': {
                const nome = await rl.question('Nome do cliente: ');
                const email = await rl.question('E-mail: ');
                const telefone = await rl.question('Telefone: ');
                await clienteController.cadastrar(nome, email, telefone);
                break;
            }
            case '4': {
                const id = await perguntarInteiro(rl, 'ID do cliente a atualizar: ');
                const nome = await rl.question('Novo nome (ou Enter para manter): ');
                const email = await rl.question('Novo e-mail (ou Enter para manter): ');
                const telefone = await rl.question('Novo telefone (ou Enter para manter): ');
                await clienteController.atualizar(id, nome, email, telefone);
                break;
            }
            case '5': {
                const id = await perguntarInteiro(rl, 'ID do cliente a remover: ');
                await clienteController.deletar(id);
                break;
            }
            case '0':
                voltar = true;
                break;
            default:
                console.log('\nOpção inválida.');
        }
    }
}

// Submenu de Livros
async function menuLivros(rl: Interface, livroController: LivroController): Promise<void> {
    let voltar = false;
    while (!voltar) {
        console.log('\n=== MENU LIVROS ===');
        console.log('1 - Listar livros');
        console.log('2 - Buscar livro por ID');
        console.log('3 - Cadastrar livro');
        console.log('4 - Atualizar livro');
        console.log('5 - Remover livro');
        console.log('0 - Voltar ao menu principal');

        const opcao = (await rl.question('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await livroController.listar();
                break;
            case '2': {
                const id = await perguntarInteiro(rl, 'Informe o ID do livro: ');
                await livroController.buscarPorId(id);
                break;
            }
            case '3': {
                const titulo = await rl.question('Título do livro: ');
                const ano = await perguntarInteiro(rl, 'Ano de publicação: ');
                const qtd = await perguntarInteiro(rl, 'Quantidade disponível: ');
                const autorId = await perguntarInteiro(rl, 'ID do autor: ');
                await livroController.cadastrar(titulo, ano, qtd, autorId);
                break;
            }
            case '4': {
                const id = await perguntarInteiro(rl, 'ID do livro a atualizar: ');
                const tituloResp = (await rl.question('Novo título (ou Enter para manter): ')).trim();
                const anoResp = (await rl.question('Novo ano de publicação (ou Enter para manter): ')).trim();
                const qtdResp = (await rl.question('Nova quantidade disponível (ou Enter para manter): ')).trim();
                const autorResp = (await rl.question('Novo ID do autor (ou Enter para manter): ')).trim();

                const dados: {
                    titulo?: string;
                    ano_publicacao?: number;
                    quantidade_disponivel?: number;
                    autor_id?: number;
                } = {};

                if (tituloResp !== '') dados.titulo = tituloResp;
                if (anoResp !== '') dados.ano_publicacao = Number(anoResp);
                if (qtdResp !== '') dados.quantidade_disponivel = Number(qtdResp);
                if (autorResp !== '') dados.autor_id = Number(autorResp);

                await livroController.atualizar(id, dados);
                break;
            }
            case '5': {
                const id = await perguntarInteiro(rl, 'ID do livro a remover: ');
                await livroController.deletar(id);
                break;
            }
            case '0':
                voltar = true;
                break;
            default:
                console.log('\nOpção inválida.');
        }
    }
}

// Submenu de Empréstimos e Devoluções
async function menuEmprestimos(rl: Interface, emprestimoController: EmprestimoController): Promise<void> {
    let voltar = false;
    while (!voltar) {
        console.log('\n=== MENU EMPRÉSTIMOS ===');
        console.log('1 - Listar empréstimos');
        console.log('2 - Realizar empréstimo');
        console.log('3 - Registrar devolução');
        console.log('0 - Voltar ao menu principal');

        const opcao = (await rl.question('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await emprestimoController.listar();
                break;
            case '2': {
                const livroId = await perguntarInteiro(rl, 'ID do livro: ');
                const clienteId = await perguntarInteiro(rl, 'ID do cliente: ');
                await emprestimoController.realizarEmprestimo(livroId, clienteId);
                break;
            }
            case '3': {
                const emprestimoId = await perguntarInteiro(rl, 'ID do empréstimo para devolução: ');
                await emprestimoController.realizarDevolucao(emprestimoId);
                break;
            }
            case '0':
                voltar = true;
                break;
            default:
                console.log('\nOpção inválida.');
        }
    }
}

// Loop principal da aplicação CLI
export async function iniciarMenuPrincipal(
    rl: Interface,
    controllers: {
        autorController: AutorController;
        clienteController: ClienteController;
        livroController: LivroController;
        emprestimoController: EmprestimoController;
    }
): Promise<void> {
    let sair = false;

    while (!sair) {
        console.log('\n====================================');
        console.log('      BOOKSTORE MANAGER CLI');
        console.log('====================================');
        console.log('1 - Gerenciar Autores');
        console.log('2 - Gerenciar Clientes');
        console.log('3 - Gerenciar Livros');
        console.log('4 - Empréstimos e Devoluções');
        console.log('0 - Sair');

        const opcao = (await rl.question('Escolha uma opção: ')).trim();

        switch (opcao) {
            case '1':
                await menuAutores(rl, controllers.autorController);
                break;
            case '2':
                await menuClientes(rl, controllers.clienteController);
                break;
            case '3':
                await menuLivros(rl, controllers.livroController);
                break;
            case '4':
                await menuEmprestimos(rl, controllers.emprestimoController);
                break;
            case '0':
                sair = true;
                console.log('\nEncerrando o BookStore Manager CLI. Até logo!');
                break;
            default:
                console.log('\nOpção inválida. Tente novamente.');
        }
    }
}