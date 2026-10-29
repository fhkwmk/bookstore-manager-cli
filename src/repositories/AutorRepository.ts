import { pool } from '../config/database.js';
import { type Autor } from '../models/Autor.js';

export class AutorRepository {
    async criar(autor: Autor): Promise<Autor> {
        const query = `
            INSERT INTO autores (nome, nacionalidade)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [autor.nome, autor.nacionalidade];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async listarTodos(): Promise<Autor[]> {
        const query = 'SELECT * FROM autores ORDER BY id ASC;';
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Autor | null> {
        const query = 'SELECT * FROM autores WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, autor: Partial<Autor>): Promise<Autor | null> {
        const query = `
            UPDATE autores
            SET nome = COALESCE($1, nome),
                nacionalidade = COALESCE($2, nacionalidade)
            WHERE id = $3
            RETURNING *;
        `;
        const values = [autor.nome, autor.nacionalidade, id];
        const result = await pool.query(query, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async deletar(id: number): Promise<boolean> {
        const query = 'DELETE FROM autores WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}