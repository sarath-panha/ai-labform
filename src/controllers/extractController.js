import { extractDentalForm } from '../services/geminiService.js';

/**
 * Controller to handle POST /api/extract image extraction requests.
 */
export async function handleExtract(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'No image file uploaded. Please provide an image file under key "file" (multipart/form-data).'
      });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 400,
        error: 'Unsupported Media Type',
        message: `File type ${req.file.mimetype} is not supported. Please upload JPEG, PNG, or WebP.`
      });
    }

    const extractionResult = await extractDentalForm(req.file.buffer, req.file.mimetype);

    // Handle edge case: blurry, unreadable, or corrupted image
    if (!extractionResult.isReadable) {
      return res.status(422).json({
        status: 422,
        error: 'Unprocessable Entity',
        message: 'The uploaded dental form is too blurry or completely unreadable by the AI.',
        unreadableReason: extractionResult.unreadableReason || 'The form text could not be clearly distinguished.'
      });
    }

    // Return exact target schema required by user
    return res.status(200).json({
      caseId: extractionResult.caseId ?? null,
      clinicName: extractionResult.clinicName ?? null,
      dentistName: extractionResult.dentistName ?? null,
      patientName: extractionResult.patientName ?? null,
      createdDate: extractionResult.createdDate ?? null,
      dueDate: extractionResult.dueDate ?? null,
      requirements: extractionResult.requirements ?? null,
      notes: extractionResult.notes ?? null
    });

  } catch (error) {
    next(error);
  }
}
