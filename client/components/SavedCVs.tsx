'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, Download } from 'lucide-react';

interface SavedCV {
  _id: string;
  originalFileName: string;
  uploadDate: string;
}

interface SavedCVsProps {
  onViewCV: (id: string) => void;
}

export default function SavedCVs({ onViewCV }: SavedCVsProps) {
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedCVs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cv/all');
        if (!response.ok) {
          throw new Error('Failed to fetch saved CVs');
        }
        const data = await response.json();
        setSavedCVs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedCVs();
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading saved CVs...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Saved CVs</h2>
      {savedCVs.length === 0 ? (
        <p className="text-slate-600">You haven't saved any CVs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedCVs.map((cv) => (
            <motion.div
              key={cv._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{cv.originalFileName}</p>
                  <p className="text-sm text-slate-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(cv.uploadDate).toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewCV(cv._id)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>View / Export</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
