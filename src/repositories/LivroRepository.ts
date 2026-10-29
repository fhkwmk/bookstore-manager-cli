import { pool } from '../config/database.js';
import type { Livro } from '../models/Livro.js';

export class LivroRepository {
    async criar(livro: Livro): Promise<Livro> {
        const query = `
            INSERT INTO livros (titulo, ano_publicacao, quantidade_disponivel, autor_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [livro.titulo, livro.ano_publicacao, livro.quantidade_disponivel, livro.autor_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async listarTodos(): Promise<Livro[]> {
        const query = `
            SELECT l.*, a.nome AS autor_nome 
            FROM livros l
            JOIN autores a ON l.autor_id = a.id
            ORDER BY l.id ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const query = `
            SELECT l.*, a.nome AS autor_nome 
            FROM livros l
            JOIN autores a ON l.autor_id = a.id
            WHERE l.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, livro: Partial<Livro>): Promise<boolean> {
        const query = `
            UPDATE livros
            SET titulo = COALESCE($1, titulo),
                ano_publicacao = COALESCE($2, ano_publicacao),
                quantidade_disponivel = COALESCE($3, quantidade_disponivel),
                autor_id = COALESCE($4, autor_id)
            WHERE id = $5;
        `;
        const values = [livro.titulo, livro.ano_publicacao, livro.quantidade_disponivel, livro.autor_id, id];
        const result = await pool.query(query, values);
        return (result.rowCount ?? 0) > 0;
    }

    async atualizarQuantidade(id: number, novaQuantidade: number): Promise<boolean> {
        const query = 'UPDATE livros SET quantidade_disponivel = $1 WHERE id = $2;';
        const result = await pool.query(query, [novaQuantidade, id]);
        return (result.rowCount ?? 0) > 0;
    }

    async deletar(id: number): Promise<boolean> {
        const query = 'DELETE FROM livros WHERE id = $1;';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}