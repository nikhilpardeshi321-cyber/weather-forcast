"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
let sequelize;
const built = buildPostgresUrlFromParts();
if (connectionString) {
    // Use the provided DATABASE_URL (Postgres expected)
    exports.sequelize = sequelize = new sequelize_1.Sequelize(connectionString, {
        dialect: 'postgres',
        logging: false,
    });
}
else if (built) {
    console.info('Using DB connection built from DB_NAME/DB_USER/DB_PASSWORD/... env vars');
    exports.sequelize = sequelize = new sequelize_1.Sequelize(built, { dialect: 'postgres', logging: false });
}
else {
    // Fallback to an in-memory sqlite DB for local development when DATABASE_URL is not set.
    console.warn('WARNING: DATABASE_URL and DB_* vars not set — falling back to in-memory SQLite. Set DATABASE_URL or DB_NAME/DB_USER/DB_PASSWORD to use Postgres.');
    exports.sequelize = sequelize = new sequelize_1.Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
}
exports.default = sequelize;
