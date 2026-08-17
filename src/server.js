import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Dental Lab Form AI Extractor Microservice Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⚡ Extraction Endpoint: POST http://localhost:${PORT}/api/extract`);
  console.log(`====================================================`);
});
