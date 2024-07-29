import React, { useState,useEffect } from 'react';
import Footer from './Footer';
import DoctorList from '../doctor/DoctorsLists';
import LabList from '../labs/LabsList';
function LandingPage({searchQuery }) {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  return (
    <div>
      <div className="homepage" style={{zIndex:1}}>
      {role === 'hospital' && <DoctorList searchQuery={searchQuery} />}
      {role === 'lab' && <LabList searchQuery={searchQuery} />}
    </div>
     <div style={{zIndex:'999'}}> <Footer />
    </div>
    </div>
  );
}

export default LandingPage;
