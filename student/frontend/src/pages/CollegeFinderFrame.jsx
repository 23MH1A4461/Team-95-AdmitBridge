import React, { useEffect, useState } from 'react';

const CollegeFinderFrame = () => {
  const [iframeUrl, setIframeUrl] = useState(import.meta.env.VITE_API_URL.replace('/api', '/'));

  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        const params = new URLSearchParams();
        
        // Only append params if they exist to avoid 'undefined'
        if (profile.cgpa) params.append('cgpa', profile.cgpa);
        if (profile.budget) params.append('budget', profile.budget);
        if (profile.country) params.append('country', profile.country);
        if (profile.branch) params.append('branch', profile.branch);
        if (profile.intake) params.append('intake', profile.intake);
        if (profile.backlogs) params.append('backlogs', profile.backlogs);
        if (profile.exam_type) params.append('exam_type', profile.exam_type);
        if (profile.exam_score) params.append('exam_score', profile.exam_score);

        const queryString = params.toString();
        if (queryString) {
          setIframeUrl(`${import.meta.env.VITE_API_URL.replace('/api', '/')}/?${queryString}`);
        }
      } catch (e) {
        console.error("Error parsing profile data", e);
      }
    }
  }, []);
  return (
    <div className="college-finder-frame fade-in" style={{ 
      height: 'calc(100vh - var(--header-height))', 
      margin: '-40px', /* Negate the .page-content padding */
      backgroundColor: 'white' 
    }}>
      <iframe 
        src={iframeUrl} 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        title="College Finder ML Model"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default CollegeFinderFrame;
