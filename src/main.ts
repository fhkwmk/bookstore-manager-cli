import { MenuPrincipal } from './menus/MenuPrincipal';
import { pool } from './config/database';

async function main() {
    const menu = new MenuPrincipal();
    try {
        await menu.iniciar();
    } catch (error) {
        console.error('Erro fatal na aplicação:', error);
    } finally {
        await pool.end();
    }
}

main();