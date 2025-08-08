import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">CV Formatter</h1>
              <p className="text-sm text-slate-600 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
            <span>✓ Professional Formatting</span>
            <span>✓ Inline Editing</span>
            <span>✓ PDF Export</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}