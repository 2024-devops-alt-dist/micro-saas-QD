import { Pool } from 'pg';
import logger from '../middlewares/logger';

// utilise DATABASE_URL si présente, sinon construit depuis les variables individuelles
const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT) || 5432,
    });

export const testDbConnection = async (): Promise<void> => {
    try {
        await pool.query('SELECT 1');
        logger.info('Connexion à la base de données réussie');
    } catch (error) {
        logger.error('Erreur de connexion à la base de données :', error);
        process.exit(1);
    }
};

export const closeDbConnection = async (): Promise<void> => {
    try {
        await pool.end();
        logger.info('Connexion à la base de données fermée');
    } catch (error) {
        logger.error('Erreur lors de la fermeture de la connexion à la base de données :', error);
    }   
}

export default pool;