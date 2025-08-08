const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Unsupported file type. Only PDF and DOCX supported for now.');
  }
}

async function formatWithAI(text) {
  const prompt = `
You are a professional CV formatter. Given the following unstructured CV content, apply these rules:
- Use a professional tone
- Remove phrases like "I am responsible for", use "Responsible for"
- Convert paragraphs to bullet points where applicable
- Format dates as "Jan 2020"
- Remove inappropriate fields like age, dependents
- Structure the CV in this order: 
  1. Header (Name, Job Title, Photo)
  2. Personal Details
  3. Profile / Summary
  4. Experience (reverse chronological)
  5. Education
  6. Skills
  7. Interests

CV Input:
${text}

Formatted CV:
`;

  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

  const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API Error: ${error}`);
  }

  const result = await response.json();
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No output from Gemini';
}


async function parseAndFormatCV(file) {
  const rawText = await extractText(file);
  const formattedCV = await formatWithAI(rawText);
  return formattedCV;
}

module.exports = { parseAndFormatCV };
