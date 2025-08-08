'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { CVData } from '@/types/cv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportCVProps {
  cvData: CVData;
  onClose: () => void;
}

export default function ExportCV({ cvData, onClose }: ExportCVProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create a temporary div with the CV content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatePDFContent(cvData);
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        background: white;
        font-family: 'Times', 'Times New Roman', serif;
        padding: 20mm;
        box-sizing: border-box;
      `;
      
      document.body.appendChild(tempDiv);
      
      // Generate PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      // Download
      pdf.save(`${cvData.header.name.replace(/\s+/g, '_')}_CV.pdf`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (data: CVData) => {
    return `
      <div style="font-family: 'Palatino Linotype', Palatino, serif; color: #1e293b; line-height: 1.6;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 8px 0; color: #1e293b;">${data.header.name}</h1>
          <h2 style="font-size: 20px; color: #3b82f6; margin: 0; font-weight: 600;">${data.header.title}</h2>
        </div>

        <!-- Personal Details -->
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Personal Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <div><strong>Nationality:</strong> ${data.personalDetails.nationality}</div>
            <div><strong>Date of Birth:</strong> ${data.personalDetails.dob}</div>
            <div><strong>Marital Status:</strong> ${data.personalDetails.maritalStatus}</div>
            <div><strong>Languages:</strong> ${data.personalDetails.languages.join(', ')}</div>
            <div><strong>Smoking Status:</strong> ${data.personalDetails.smokingStatus}</div>
            <div><strong>Driving Licence:</strong> ${data.personalDetails.drivingLicence}</div>
          </div>
        </div>

        <!-- Profile -->
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Professional Profile</h3>
          <p style="font-size: 14px; text-align: justify; margin: 0;">${data.profile}</p>
        </div>

        <!-- Experience -->
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Professional Experience</h3>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 20px; border-left: 3px solid #3b82f6; padding-left: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h4 style="font-size: 16px; font-weight: bold; margin: 0; color: #1e293b;">${exp.title}</h4>
                <span style="font-size: 12px; color: #64748b; font-weight: 600;">${exp.startDate} - ${exp.endDate}</span>
              </div>
              <p style="font-size: 14px; margin: 0 0 8px 0; color: #475569; font-weight: 600;">${exp.employer} • ${exp.location}</p>
              <ul style="margin: 0; padding-left: 20px;">
                ${exp.bulletPoints.map(point => `<li style="font-size: 14px; margin-bottom: 4px; color: #475569;">${point}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Education -->
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Education</h3>
          ${data.education.map(edu => `
            <div style="margin-bottom: 15px; border-left: 3px solid #3b82f6; padding-left: 15px;">
              <h4 style="font-size: 16px; font-weight: bold; margin: 0 0 2px 0; color: #1e293b;">${edu.degree}</h4>
              <p style="font-size: 14px; margin: 0 0 2px 0; color: #475569;">${edu.institution}</p>
              <p style="font-size: 12px; margin: 0; color: #64748b;">${edu.graduationDate}</p>
            </div>
          `).join('')}
        </div>

        <!-- Skills and Interests -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <div>
            <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Key Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${data.skills.map(skill => `
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${skill}</span>
              `).join('')}
            </div>
          </div>
          <div>
            <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Interests</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${data.interests.map(interest => `
                <span style="background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${interest}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Export CV as PDF</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Professional PDF Format</p>
                <p className="text-sm text-slate-600">Palatino Linotype font, optimized for printing</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>✓ Clean, professional layout</p>
              <p>✓ Optimized for ATS systems</p>
              <p>✓ Print-ready format</p>
              <p>✓ All sections included</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToPDF}
              disabled={isExporting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}