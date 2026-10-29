import { pool } from '../config/database.js';
import { type Cliente } from '../models/Cliente.js';

export class ClienteRepository {
    async criar(cliente: Cliente): Promise<Cliente> {
        const query = `
            INSERT INTO clientes (nome, email, telefone)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [cliente.nome, cliente.email, cliente.telefone];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async listarTodos(): Promise<Cliente[]> {
        const query = 'SELECT * FROM clientes ORDER BY id ASC;';
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Cliente | null> {
        const query = 'SELECT * FROM clientes WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, cliente: Partial<Cliente>): Promise<Cliente | null> {
        const query = `
            UPDATE clientes
            SET nome = COALESCE($1, nome),
                email = COALESCE($2, email),
                telefone = COALESCE($3, telefone)
            WHERE id = $4
            RETURNING *;
        `;
        const values = [cliente.nome, cliente.email, cliente.telefone, id];
        const result = await pool.query(query, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async deletar(id: number): Promise<boolean> {
        const query = 'DELETE FROM clientes WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}