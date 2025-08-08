'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import CVPreview from '@/components/CVPreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import { CVData } from '@/types/cv';
import SavedCVs from '@/components/SavedCVs';

type View = 'main' | 'saved';

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [cvId, setCvId] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('main');

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/cv/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const result = await response.json();

      // The backend now returns a parsed JSON object and the cvId.
      const formattedCV = result.formatted;
      const newCvId = result.cvId;
      
      // For now, originalText is not returned from backend, so we'll clear it.
      // We can add this feature later if needed.
      setOriginalText('');
      setCvData(formattedCV);
      setCvId(newCvId);

    } catch (err: any) {
      setError(err.message || 'Failed to process your CV. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCVData = (newData: CVData) => {
    setCvData(newData);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    // Reset CV data when switching views
    if (newView === 'main') {
      setCvData(null);
      setCvId(null);
    }
  };

  const handleViewSavedCV = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/cv/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch CV data.');
      }
      const data = await response.json();

      // The formattedCV from DB is a string, so we need to parse it.
      const formatted = JSON.parse(data.formattedCV);

      setCvData(formatted);
      setCvId(data._id);
      setOriginalText(data.originalText || ''); // Assuming originalText might be stored
      setView('main'); // Switch back to the main view to show the preview

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header onToggleView={handleViewChange} currentView={view} />
      
      <div className="container mx-auto px-4 py-8">
        {view === 'saved' ? (
          <SavedCVs onViewCV={handleViewSavedCV} />
        ) : (
          <>
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
                  recruiter-ready format.
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

            {cvData && cvId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CVPreview
                  cvId={cvId}
                  cvData={cvData}
                  originalText={originalText}
                  onUpdateCV={updateCVData}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}