import { pool } from './config/database';

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW() AS current_time');
        console.log('Conexão bem-sucedida com o PostgreSQL!');
        console.log('Horário do banco:', res.rows[0].current_time);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } finally {
        await pool.end();
    }
}

testConnection();