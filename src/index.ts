import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and models synced.');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app', err);
    process.exit(1);
  }
}

start();
