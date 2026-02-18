"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const models_1 = require("./models");
const PORT = process.env.PORT || 3000;
async function start() {
    try {
        await models_1.sequelize.authenticate();
        await models_1.sequelize.sync();
        console.log('Database connected and models synced.');
        app_1.default.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
    catch (err) {
        console.error('Failed to start app', err);
        process.exit(1);
    }
}
start();
