import { GoogleGenAI, Type } from '@google/genai';

/**
 * Extraction response JSON schema definition for Gemini.
 */
const dentalFormSchema = {
  type: Type.OBJECT,
  properties: {
    isReadable: {
      type: Type.BOOLEAN,
      description: "True if the dental lab form is legible and readable. False if blurry, corrupted, unreadable, or not a dental lab form."
    },
    unreadableReason: {
      type: Type.STRING,
      description: "Detailed explanation if isReadable is false; null if readable."
    },
    caseId: {
      type: Type.STRING,
      description: "The dental case ID or work order code (e.g. SO21082)."
    },
    clinicName: {
      type: Type.STRING,
      description: "The dental clinic or hospital name."
    },
    dentistName: {
      type: Type.STRING,
      description: "The doctor / dentist name."
    },
    patientName: {
      type: Type.STRING,
      description: "The patient full name."
    },
    createdDate: {
      type: Type.STRING,
      description: "Creation or start date in YYYY-MM-DD format."
    },
    dueDate: {
      type: Type.STRING,
      description: "Expected delivery or due date in YYYY-MM-DD format."
    },
    requirements: {
      type: Type.STRING,
      description: "Exact raw text extracted from 'Other requirements:' label without any text optimization, sanitization, or additions."
    },
    notes: {
      type: Type.STRING,
      description: "Exact raw 1:1 literal visual transcription of all handwritten notes. Do not optimize, sanitize, reformat, summarize, or alter any text, contact details, or Khmer/English characters."
    }
  },
  required: ["isReadable"]
};

/**
 * Service to process dental lab form images using Google Gemini AI.
 * 
 * @param {Buffer} imageBuffer - Raw image buffer
 * @param {string} mimeType - Image MIME type (e.g. image/jpeg, image/png)
 * @returns {Promise<Object>} Extracted structured data
 */
export async function extractDentalForm(imageBuffer, mimeType = 'image/jpeg') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const prompt = `You are a strict raw Optical Character Recognition (OCR) transcription engine.
Your task is to visually transcribe the exact text from the provided dental lab form image into JSON.

STRICT RAW TRANSCRIPTION RULES (CRITICAL):
1. DO NOT optimize, sanitize, fix grammar, smooth, summarize, or modify any extracted text.
2. DO NOT add, alter, or remove any contact information, symbols, numbers, or letters.
3. Transcribe exact handwritten text character-for-character, preserving exact numbers (e.g. #34, #35), punctuation, and multilingual text (Khmer script and English words).

FIELD GUIDELINES:
- \`isReadable\`: Set to false ONLY if the image is too blurry, corrupted, or not a dental form. Set to true if readable.
- \`unreadableReason\`: Provide reason if isReadable is false, else null.
- \`caseId\`: Case or order ID string (e.g. "SO21082").
- \`clinicName\`: Clinic/hospital name string.
- \`dentistName\`: Doctor/dentist name string.
- \`patientName\`: Patient name string.
- \`createdDate\`: Date in YYYY-MM-DD format.
- \`dueDate\`: Date in YYYY-MM-DD format.
- \`requirements\`: RAW EXACT text from "Other requirements:" section (e.g. "implant Osstem (#34Standard) (#35Mini)").
- \`notes\`: RAW EXACT 1:1 literal visual transcription of handwritten notes. Transcribe exact raw characters from the image without post-processing.

Return valid JSON adhering strictly to the response schema.`;

  const base64Data = imageBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      prompt
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: dentalFormSchema,
      temperature: 0.0
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return JSON.parse(responseText);
}
