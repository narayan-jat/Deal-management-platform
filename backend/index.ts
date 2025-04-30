import express, { Request, Response } from 'express';

const app = express();
const PORT = 4000;

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('GoDex Backend is live!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
