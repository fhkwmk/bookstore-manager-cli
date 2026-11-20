// Cria interface de entrada/saída via stdin e stdout do Node
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Repositórios em memória (carregados a partir de src/data/seed.ts)
import { AutorRepository } from './repositories/AutorRepository.js';
import { ClienteRepository } from './repositories/ClienteRepository.js';
import { LivroRepository } from './repositories/LivroRepository.js';
import { EmprestimoRepository } from './repositories/EmprestimoRepository.js';

// Camada de serviços (regras de negócio e validações)
import { AutorService } from './services/AutorService.js';
import { ClienteService } from './services/ClienteService.js';
import { LivroService } from './services/LivroService.js';
import { EmprestimoService } from './services/EmprestimoService.js';

// Camada de controllers (interação CLI e formatação)
import { AutorController } from './controllers/AutorController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { LivroController } from './controllers/LivroController.js';
import { EmprestimoController } from './controllers/EmprestimoController.js';

// Menu interativo principal
import { iniciarMenuPrincipal } from './menus/MenuPrincipal.js';

async function bootstrap(): Promise<void> {
    const rl = readline.createInterface({ input, output });

    try {
        // Instancia uma única vez os repositórios compartilhados em memória
        const autorRepository = new AutorRepository();
        const clienteRepository = new ClienteRepository();
        const livroRepository = new LivroRepository();
        const emprestimoRepository = new EmprestimoRepository();

        // Instancia os serviços injetando os respectivos repositórios
        const autorService = new AutorService(autorRepository, livroRepository);
        const clienteService = new ClienteService(clienteRepository, emprestimoRepository);
        const livroService = new LivroService(livroRepository, autorRepository, emprestimoRepository);
        const emprestimoService = new EmprestimoService(
            emprestimoRepository,
            livroRepository,
            clienteRepository
        );

        // Instancia os controllers injetando os serviços
        const autorController = new AutorController(autorService);
        const clienteController = new ClienteController(clienteService);
        const livroController = new LivroController(livroService);
        const emprestimoController = new EmprestimoController(emprestimoService);

        // Inicia o loop do menu principal
        await iniciarMenuPrincipal(rl, {
            autorController,
            clienteController,
            livroController,
            emprestimoController,
        });
    } catch (error) {
        console.error(`\nErro fatal na aplicação: ${(error as Error).message}`);
    } finally {
        // Fecha sempre a interface readline ao encerrar
        rl.close();
    }
}

void bootstrap();