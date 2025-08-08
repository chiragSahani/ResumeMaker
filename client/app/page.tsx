'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import CVPreview from '@/components/CVPreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import { CVData } from '@/types/cv';

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // TODO: Replace with your actual backend endpoint
      // For now, we'll simulate the API call with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - replace with actual API call
      const mockResponse = {
        originalText: "JOHN DOE\nPrivate Personal Assistant\n\nPersonal Details:\nNationality: Romanian\nDate of Birth: Oct 1989\nMarital Status: Single\nLanguages: English, French\nSmoking Status: Non-Smoker\nDriving Licence: Full Driving Licence\n\nProfile:\nExperienced PA with 10+ years supporting high-profile clients in various capacities...",
        formattedCV: {
          header: {
            name: "John Doe",
            title: "Private Personal Assistant"
          },
          personalDetails: {
            nationality: "Romanian",
            dob: "Oct 1989",
            maritalStatus: "Single",
            languages: ["English", "French"],
            smokingStatus: "Non-Smoker",
            drivingLicence: "Full Driving Licence"
          },
          profile: "Experienced PA with 10+ years supporting high-profile clients in various capacities. Proven track record of managing complex schedules, international travel arrangements, and confidential communications. Demonstrates exceptional organizational skills and cultural sensitivity while maintaining the highest level of discretion and professionalism.",
          experience: [
            {
              title: "Personal Assistant",
              employer: "Royal Household",
              location: "Riyadh, KSA",
              startDate: "Mar 2019",
              endDate: "Apr 2022",
              bulletPoints: [
                "Coordinated international travel arrangements for VIP clients across multiple time zones",
                "Managed household staff of 5+ people including scheduling and performance oversight",
                "Maintained confidential correspondence and documentation with government officials",
                "Organized high-profile social events for up to 100 guests"
              ]
            },
            {
              title: "Executive Assistant",
              employer: "Private Family Office",
              location: "London, UK",
              startDate: "Jan 2016",
              endDate: "Feb 2019",
              bulletPoints: [
                "Provided comprehensive administrative support to C-level executives",
                "Coordinated complex international business meetings and conferences",
                "Managed personal and professional calendars with competing priorities"
              ]
            }
          ],
          education: [
            {
              institution: "Liceo Scientifico Alessandro Volta",
              degree: "High School Diploma",
              graduationDate: "Jun 2009"
            }
          ],
          skills: ["Organisational skills", "Discretion and Confidentiality", "Java Programming", "Multi-language Communication", "International Protocol"],
          interests: ["Fitness and Gym Training", "Software Development", "Cultural Studies", "Travel"]
        }
      };

      setOriginalText(mockResponse.originalText);
      setCvData(mockResponse.formattedCV);
    } catch (err) {
      setError('Failed to process your CV. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCVData = (newData: CVData) => {
    setCvData(newData);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!cvData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              AI-Powered CV Formatter
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Upload your CV and let our AI transform it into a professional, 
              recruiter-ready format. Supports PDF, DOCX, XLS, and XLSX files.
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 text-sm hover:text-red-700 mt-2"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {!cvData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FileUpload onFileUpload={handleFileUpload} />
          </motion.div>
        )}

        {cvData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CVPreview
              cvData={cvData}
              originalText={originalText}
              onUpdateCV={updateCVData}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}