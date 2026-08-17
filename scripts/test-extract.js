import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { extractDentalForm } from '../src/services/geminiService.js';

async function runTest() {
  console.log('--- Testing Dental Lab Form Extraction ---');
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set in .env! Please set it before running this test.');
    process.exit(1);
  }

  const samplePath = path.resolve('example.jpg');
  if (!fs.existsSync(samplePath)) {
    console.error('❌ Sample image example.jpg not found at:', samplePath);
    process.exit(1);
  }

  console.log('📷 Reading sample image:', samplePath);
  const imageBuffer = fs.readFileSync(samplePath);

  console.log('🤖 Sending request to Google Gemini AI...');
  try {
    const result = await extractDentalForm(imageBuffer, 'image/jpeg');
    console.log('\n✅ Extraction Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\n❌ Extraction Failed:', error.message);
  }
}

runTest();
