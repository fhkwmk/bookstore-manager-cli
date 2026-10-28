import { pool } from '../config/database';
import { Emprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {
    async registrarEmprestimo(livroId: number, clienteId: number): Promise<Emprestimo> {
        const query = `
            INSERT INTO emprestimos (livro_id, cliente_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [livroId, clienteId]);
        return result.rows[0];
    }

    async registrarDevolucao(emprestimoId: number): Promise<Emprestimo | null> {
        const query = `
            UPDATE emprestimos
            SET status = 'DEVOLVIDO',
                data_devolucao = CURRENT_DATE
            WHERE id = $1 AND status = 'EMPRESTADO'
            RETURNING *;
        `;
        const result = await pool.query(query, [emprestimoId]);
        return result.rows.length ? result.rows[0] : null;
    }

    async listarTodos(): Promise<Emprestimo[]> {
        const query = `
            SELECT e.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
            FROM emprestimos e
            JOIN livros l ON e.livro_id = l.id
            JOIN clientes c ON e.cliente_id = c.id
            ORDER BY e.id ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        const query = 'SELECT * FROM emprestimos WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }
}