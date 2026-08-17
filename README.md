# 🦷 Dental Lab Form AI Extraction Microservice

An AI-powered microservice built with **Node.js, Express v5, and Google Gemini AI (`@google/genai`)** to extract structured information from uploaded dental lab form images into JSON format.

---

## 🌟 Features

- **Google Gemini AI 2.5 Flash**: Utilizes strict JSON Schema structured output mode for precise 1:1 raw visual OCR transcription.
- **Multilingual Handwriting Recognition**: Accurately transcribes both English dental terminology and Khmer handwriting script.
- **Edge Case & Unreadability Handling**: Returns `HTTP 422 Unprocessable Entity` with explicit reasons if an image is blurry, corrupted, or unreadable.
- **Rate Limit Protection**: Integrates `express-rate-limit` middleware (`HTTP 429 Too Many Requests`) to prevent API credit exhaustion.
- **Interactive Web UI**: Includes a web client at `/` to test uploads, view live responses, and monitor rate limit quotas.

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your Google Gemini API key inside `.env`:
```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=20
```

### 3. Run Service
```bash
npm start
```
Access the Web UI test interface at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploying to Render

### Option A: Automatic Blueprint Deployment (Recommended)

1. Push your project repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your repository. Render will automatically detect the `render.yaml` file.
5. In the Render Dashboard, set your environment variable:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
6. Click **Apply**. Render will build and deploy your web service automatically!

### Option B: Manual Web Service Setup

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your Git repository.
4. Configure service settings:
   - **Name**: `dental-labform-extractor`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `<your_gemini_api_key>`
   - `RATE_LIMIT_WINDOW_MS`: `900000`
   - `RATE_LIMIT_MAX`: `20`
6. Click **Create Web Service**.

---

## 📡 API Endpoint Reference

### `POST /api/extract`
Extracts information from an uploaded dental lab form image.

- **Header**: `Content-Type: multipart/form-data`
- **Body Field**: `file` (JPEG, PNG, WebP image)

#### Example Success Response (`200 OK`)
```json
{
  "caseId": "SO21082",
  "clinicName": "Khema Digital Dental Solution",
  "dentistName": "MineralDC",
  "patientName": "Chy Vannthorn",
  "createdDate": "2026-08-12",
  "dueDate": "2026-08-17",
  "requirements": "implant Osstem (#34Standard) (#35Mini)",
  "notes": "Zirconia crown on implant #34, #35 ដាច់, system osstem Regular #34, osstem mini #35, ចាក់ពុម្ពហើយរើស Abutment ខ្លួនឯង, រើស Abutment on 13.8.26."
}
```

#### Example Blurry Image Response (`422 Unprocessable Entity`)
```json
{
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "The uploaded dental form is too blurry or completely unreadable by the AI.",
  "unreadableReason": "Image quality is too low to distinguish handwritten text."
}
```
