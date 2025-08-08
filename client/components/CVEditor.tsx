'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';
import { CVData, ExperienceItem, EducationItem } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CVEditorProps {
  cvData: CVData;
  onUpdateCV: (data: CVData) => void;
}

export default function CVEditor({ cvData, onUpdateCV }: CVEditorProps) {
  const [editData, setEditData] = useState<CVData>(cvData);

  const updateField = (section: keyof CVData, field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      title: '',
      employer: '',
      location: '',
      startDate: '',
      endDate: '',
      bulletPoints: ['']
    };
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addBulletPoint = (expIndex: number) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? { ...exp, bulletPoints: [...exp.bulletPoints, ''] } : exp
      )
    }));
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bulletPoints: exp.bulletPoints.map((bullet, j) => 
            j === bulletIndex ? value : bullet
          )
        } : exp
      )
    }));
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bulletPoints: exp.bulletPoints.filter((_, j) => j !== bulletIndex)
        } : exp
      )
    }));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      institution: '',
      degree: '',
      graduationDate: ''
    };
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setEditData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index: number) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    setEditData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const updateInterest = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.map((interest, i) => i === index ? value : interest)
    }));
  };

  const removeInterest = (index: number) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const saveChanges = () => {
    onUpdateCV(editData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Edit Your CV</h3>
        <Button onClick={saveChanges} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle>Header Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <Input
                value={editData.header.name}
                onChange={(e) => updateField('header', 'name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <Input
                value={editData.header.title}
                onChange={(e) => updateField('header', 'title', e.target.value)}
                placeholder="Your job title"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
              <Input
                value={editData.personalDetails.nationality}
                onChange={(e) => updateField('personalDetails', 'nationality', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <Input
                value={editData.personalDetails.dob}
                onChange={(e) => updateField('personalDetails', 'dob', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
              <Input
                value={editData.personalDetails.maritalStatus}
                onChange={(e) => updateField('personalDetails', 'maritalStatus', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Languages (comma-separated)</label>
              <Input
                value={editData.personalDetails.languages.join(', ')}
                onChange={(e) => updateField('personalDetails', 'languages', e.target.value.split(', ').filter(Boolean))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Smoking Status</label>
              <Input
                value={editData.personalDetails.smokingStatus}
                onChange={(e) => updateField('personalDetails', 'smokingStatus', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Driving Licence</label>
              <Input
                value={editData.personalDetails.drivingLicence}
                onChange={(e) => updateField('personalDetails', 'drivingLicence', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={editData.profile}
            onChange={(e) => setEditData(prev => ({ ...prev, profile: e.target.value }))}
            placeholder="Write your professional summary..."
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Professional Experience</CardTitle>
            <Button onClick={addExperience} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editData.experience.map((exp, expIndex) => (
            <motion.div
              key={expIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-800">Experience {expIndex + 1}</h4>
                <Button
                  onClick={() => removeExperience(expIndex)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                  placeholder="Job Title"
                />
                <Input
                  value={exp.employer}
                  onChange={(e) => updateExperience(expIndex, 'employer', e.target.value)}
                  placeholder="Company/Employer"
                />
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                  placeholder="Location"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateExperience(expIndex, 'startDate', e.target.value)}
                    placeholder="Start Date"
                  />
                  <Input
                    value={exp.endDate}
                    onChange={(e) => updateExperience(expIndex, 'endDate', e.target.value)}
                    placeholder="End Date"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Key Achievements</label>
                  <Button
                    onClick={() => addBulletPoint(expIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.bulletPoints.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-center space-x-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) => updateBulletPoint(expIndex, bulletIndex, e.target.value)}
                        placeholder="Describe your achievement or responsibility..."
                        className="min-h-16"
                      />
                      <Button
                        onClick={() => removeBulletPoint(expIndex, bulletIndex)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button onClick={addEducation} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-800">Education {index + 1}</h4>
                <Button
                  onClick={() => removeEducation(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Institution"
                />
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Degree/Qualification"
                />
                <Input
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                  placeholder="Graduation Date"
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Skills and Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button onClick={addSkill} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {editData.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Skill name"
                />
                <Button
                  onClick={() => removeSkill(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interests</CardTitle>
              <Button onClick={addInterest} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Interest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {editData.interests.map((interest, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={interest}
                  onChange={(e) => updateInterest(index, e.target.value)}
                  placeholder="Interest"
                />
                <Button
                  onClick={() => removeInterest(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}