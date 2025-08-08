const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { parseAndFormatCV } = require('../services/aiProcessor');
const CVModel = require('../models/CVModel');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { PDFDocument } = require('pdf-lib');


// Upload and format CV
router.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const formatted = await parseAndFormatCV(file);
    fs.unlinkSync(file.path);

    const newCV = new CVModel({
      originalFileName: file.originalname,
      formattedCV: formatted
    });
    await newCV.save();

    res.json({ formatted });
  } catch (err) {
    console.error('Upload Error:', err); // 👈 Show detailed error in console
    res.status(500).json({ error: err.message || 'Server error' }); // 👈 Return real error
  }
});

// Get all CVs
router.get('/all', async (req, res) => {
  try {
    const cvs = await CVModel.find().sort({ uploadDate: -1 });
    res.json(cvs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch CVs' });
  }
});

// Get single CV
router.get('/:id', async (req, res) => {
  try {
    const cv = await CVModel.findById(req.params.id);
    if (!cv) return res.status(404).json({ error: 'CV not found' });
    res.json(cv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch CV' });
  }
});

// Export CV as .txt
router.get('/:id/export', async (req, res) => {
  try {
    const cv = await CVModel.findById(req.params.id);
    if (!cv) return res.status(404).json({ error: 'CV not found' });

    const filename = `${cv.originalFileName.split('.')[0]}_formatted.txt`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(cv.formattedCV);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CV' });
  }
});

// Export as .docx
router.get('/:id/export-docx', async (req, res) => {
  try {
    const cv = await CVModel.findById(req.params.id);
    if (!cv) return res.status(404).json({ error: 'CV not found' });

    // Split text into paragraphs
    const paragraphs = cv.formattedCV.split('\n').map(line =>
      new Paragraph({ children: [new TextRun(line)] })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const buffer = await Packer.toBuffer(doc);

    const filename = `${cv.originalFileName.split('.')[0]}_formatted.docx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    console.error('DOCX Export Error:', err);
    res.status(500).json({ error: 'Failed to export DOCX' });
  }
});
// Export as .pdf
router.get('/:id/export-pdf', async (req, res) => {
  try {
    const cv = await CVModel.findById(req.params.id);
    if (!cv) return res.status(404).json({ error: 'CV not found' });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;

    const lines = cv.formattedCV.split('\n');
    let y = height - margin;

    lines.forEach((line) => {
      if (y < margin) {
        page.drawText("...content trimmed...");
        return;
      }
      page.drawText(line, { x: margin, y, size: fontSize });
      y -= fontSize + 4;
    });

    const pdfBytes = await pdfDoc.save();

    const filename = `${cv.originalFileName.split('.')[0]}_formatted.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF Export Error:', err);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});



module.exports = router;
