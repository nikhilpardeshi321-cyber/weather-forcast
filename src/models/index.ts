import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Prefer full DATABASE_URL, else build from DB_* pieces, else fallback to in-memory sqlite
const connectionString = process.env.DATABASE_URL || null;

function buildPostgresUrlFromParts() {
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';

  if (name && user && password) {
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
  }
  return null;
}

let sequelize: Sequelize;
const built = buildPostgresUrlFromParts();
if (connectionString) {
  // Use the provided DATABASE_URL (Postgres expected)
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
  });
} else if (built) {
  console.info('Using DB connection built from DB_NAME/DB_USER/DB_PASSWORD/... env vars');
  sequelize = new Sequelize(built, { dialect: 'postgres', logging: false });
} else {
  // Fallback to an in-memory sqlite DB for local development when DATABASE_URL is not set.
  console.warn('WARNING: DATABASE_URL and DB_* vars not set — falling back to in-memory SQLite. Set DATABASE_URL or DB_NAME/DB_USER/DB_PASSWORD to use Postgres.');
  sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
}

export { sequelize };
export default sequelize;
