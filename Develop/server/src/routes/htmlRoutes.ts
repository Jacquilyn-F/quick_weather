import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define route to serve index.html
router.get('/', (_req, res) => {
  const filePath = path.join(__dirname, '..', '..', '..', 'client', 'dist', 'index.html'); 
  res.sendFile(filePath);
});

export default router;