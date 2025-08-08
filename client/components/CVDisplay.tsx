import { motion } from 'framer-motion';
import { CVData } from '@/types/cv';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

interface CVDisplayProps {
  cvData: CVData;
}

export default function CVDisplay({ cvData }: CVDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white" id="cv-content">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center border-b border-slate-200 pb-6"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {cvData.header.name}
          </h1>
          <h2 className="text-xl text-blue-600 font-medium">
            {cvData.header.title}
          </h2>
        </motion.div>

        {/* Personal Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 text-lg mb-3">Personal Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nationality:</span> {cvData.personalDetails.nationality}</p>
              <p><span className="font-medium">Date of Birth:</span> {cvData.personalDetails.dob}</p>
              <p><span className="font-medium">Marital Status:</span> {cvData.personalDetails.maritalStatus}</p>
              <p><span className="font-medium">Languages:</span> {cvData.personalDetails.languages.join(', ')}</p>
              <p><span className="font-medium">Smoking Status:</span> {cvData.personalDetails.smokingStatus}</p>
              <p><span className="font-medium">Driving Licence:</span> {cvData.personalDetails.drivingLicence}</p>
            </div>
          </div>
        </motion.section>

        {/* Profile */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-slate-800 text-lg mb-3">Professional Profile</h3>
          <p className="text-slate-700 leading-relaxed">
            {cvData.profile}
          </p>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-slate-800 text-lg mb-4">Professional Experience</h3>
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">{exp.title}</h4>
                  <span className="text-sm text-slate-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-slate-700 font-medium mb-1">
                  {exp.employer} • {exp.location}
                </p>
                <ul className="space-y-1 mt-2">
                  {exp.bulletPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-slate-700 text-sm flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-slate-800 text-lg mb-4">Education</h3>
          <div className="space-y-4">
            {cvData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <h4 className="font-semibold text-slate-800">{edu.degree}</h4>
                <p className="text-slate-700">{edu.institution}</p>
                <p className="text-sm text-slate-600">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills and Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <section>
            <h3 className="font-semibold text-slate-800 text-lg mb-3">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 text-lg mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {cvData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}