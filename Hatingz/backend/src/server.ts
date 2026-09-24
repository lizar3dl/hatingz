import app from './app';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Ratingz backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error('[ratingz] Database initialization failed:', error);
    process.exitCode = 1;
  });
