export interface CVData {
  header: {
    name: string;
    title: string;
  };
  personalDetails: {
    nationality: string;
    dob: string;
    maritalStatus: string;
    languages: string[];
    smokingStatus: string;
    drivingLicence: string;
  };
  profile: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  interests: string[];
}

export interface ExperienceItem {
  title: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  bulletPoints: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  graduationDate: string;
}