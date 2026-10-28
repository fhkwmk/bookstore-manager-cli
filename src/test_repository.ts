import { AutorRepository } from './repositories/AutorRepository';
import { pool } from './config/database';

async function testRepository() {
    const autorRepo = new AutorRepository();

    try {
        console.log('--- TESTANDO AUTOR REPOSITORY ---');

        // 1. Listar autores cadastrados
        const autores = await autorRepo.listarTodos();
        console.log('Autores cadastrados no banco:', autores);

        // 2. Criar um novo autor de teste
        const novoAutor = await autorRepo.criar({
            nome: 'Graciliano Ramos',
            nacionalidade: 'Brasileira'
        });
        console.log('Autor inserido:', novoAutor);

    } catch (error) {
        console.error('Erro ao testar o repositório:', error);
    } finally {
        await pool.end();
    }
}

testRepository();