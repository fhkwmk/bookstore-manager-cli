import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { LivroService } from '../services/LivroService';
import { EmprestimoService } from '../services/EmprestimoService';
import { AutorRepository } from '../repositories/AutorRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class MenuPrincipal {
    private rl = readline.createInterface({ input, output });
    private livroService = new LivroService();
    private emprestimoService = new EmprestimoService();
    private autorRepo = new AutorRepository();
    private clienteRepo = new ClienteRepository();

    public async iniciar(): Promise<void> {
        let sair = false;

        while (!sair) {
            console.log('\n========================================');
            console.log('       📚 BOOKSTORE MANAGER CLI         ');
            console.log('========================================');
            console.log('1. Listar Autores');
            console.log('2. Listar Clientes');
            console.log('3. Listar Livros');
            console.log('4. Cadastrar Novo Livro');
            console.log('5. Atualizar Livro');
            console.log('6. Remover Livro');
            console.log('7. Listar Empréstimos');
            console.log('8. Realizar Empréstimo');
            console.log('9. Realizar Devolução');
            console.log('0. Sair');
            console.log('----------------------------------------');

            const opcao = await this.rl.question('Escolha uma opção: ');

            try {
                switch (opcao.trim()) {
                    case '1':
                        await this.listarAutores();
                        break;
                    case '2':
                        await this.listarClientes();
                        break;
                    case '3':
                        await this.listarLivros();
                        break;
                    case '4':
                        await this.cadastrarLivro();
                        break;
                    case '5':
                        await this.atualizarLivro();
                        break;
                    case '6':
                        await this.removerLivro();
                        break;
                    case '7':
                        await this.listarEmprestimos();
                        break;
                    case '8':
                        await this.realizarEmprestimo();
                        break;
                    case '9':
                        await this.realizarDevolucao();
                        break;
                    case '0':
                        sair = true;
                        console.log('\nEncerrando a aplicação. Até logo!');
                        break;
                    default:
                        console.log('\nOpção inválida! Tente novamente.');
                }
            } catch (error: any) {
                console.log(`\n❌ Erro: ${error.message}`);
            }
        }

        this.rl.close();
    }

    private async listarAutores(): Promise<void> {
        const autores = await this.autorRepo.listarTodos();
        console.log('\n--- LISTA DE AUTORES ---');
        console.table(autores);
    }

    private async listarClientes(): Promise<void> {
        const clientes = await this.clienteRepo.listarTodos();
        console.log('\n--- LISTA DE CLIENTES ---');
        console.table(clientes);
    }

    private async listarLivros(): Promise<void> {
        const livros = await this.livroService.listarLivros();
        console.log('\n--- LISTA DE LIVROS ---');
        console.table(livros);
    }

    private async cadastrarLivro(): Promise<void> {
        console.log('\n--- CADASTRAR NOVO LIVRO ---');
        const titulo = await this.rl.question('Título do livro: ');
        const anoStr = await this.rl.question('Ano de publicação: ');
        const qtdStr = await this.rl.question('Quantidade disponível: ');
        const autorIdStr = await this.rl.question('ID do Autor: ');

        await this.livroService.cadastrarLivro({
            titulo,
            ano_publicacao: Number(anoStr),
            quantidade_disponivel: Number(qtdStr),
            autor_id: Number(autorIdStr)
        });

        console.log('\n✅ Livro cadastrado com sucesso!');
    }

    private async atualizarLivro(): Promise<void> {
        console.log('\n--- ATUALIZAR LIVRO ---');
        const idStr = await this.rl.question('ID do livro que deseja atualizar: ');
        const id = Number(idStr);

        // Opcional: exibe o livro atual para referência
        const livroAtual = await this.livroService.buscarPorId(id);
        console.log(`Livro atual: "${livroAtual?.titulo}" (Estoque: ${livroAtual?.quantidade_disponivel})`);

        const titulo = await this.rl.question('Novo título (deixe em branco para manter): ');
        const anoStr = await this.rl.question('Novo ano de publicação (deixe em branco para manter): ');
        const qtdStr = await this.rl.question('Nova quantidade disponível (deixe em branco para manter): ');
        const autorIdStr = await this.rl.question('Novo ID do Autor (deixe em branco para manter): ');

        await this.livroService.atualizarLivro(id, {
            titulo: titulo.trim() !== '' ? titulo : undefined,
            ano_publicacao: anoStr.trim() !== '' ? Number(anoStr) : undefined,
            quantidade_disponivel: qtdStr.trim() !== '' ? Number(qtdStr) : undefined,
            autor_id: autorIdStr.trim() !== '' ? Number(autorIdStr) : undefined
        });

        console.log('\n✅ Livro atualizado com sucesso!');
    }

    private async removerLivro(): Promise<void> {
        console.log('\n--- REMOVER LIVRO ---');
        const idStr = await this.rl.question('ID do livro que deseja remover: ');
        const id = Number(idStr);

        await this.livroService.deletarLivro(id);
        console.log('\n✅ Livro removido com sucesso!');
    }

    private async listarEmprestimos(): Promise<void> {
        const emprestimos = await this.emprestimoService.listarEmprestimos();
        console.log('\n--- LISTA DE EMPRÉSTIMOS ---');
        console.table(emprestimos);
    }

    private async realizarEmprestimo(): Promise<void> {
        console.log('\n--- REALIZAR EMPRÉSTIMO ---');
        const livroIdStr = await this.rl.question('ID do Livro: ');
        const clienteIdStr = await this.rl.question('ID do Cliente: ');

        await this.emprestimoService.realizarEmprestimo(Number(livroIdStr), Number(clienteIdStr));
        console.log('\n✅ Empréstimo realizado com sucesso!');
    }

    private async realizarDevolucao(): Promise<void> {
        console.log('\n--- REALIZAR DEVOLUÇÃO ---');
        const empIdStr = await this.rl.question('ID do Empréstimo: ');

        await this.emprestimoService.realizarDevolucao(Number(empIdStr));
        console.log('\n✅ Devolução registrada com sucesso!');
    }
}