import React, { useState,useEffect } from 'react';
import Footer from './Footer';
import DoctorList from '../doctor/DoctorsLists';
import LabList from '../labs/LabsList';
function LandingPage({searchQuery,doctors, tests,role  }) {


  return (
    <div>
      <div className="homepage" style={{zIndex:1}}>
      {role === 'hospital' && <DoctorList searchQuery={searchQuery} doctors={doctors}/>}
      {role === 'lab' && <LabList searchQuery={searchQuery} tests={tests}/>}
    </div>
     <div style={{zIndex:'999'}}> <Footer />
    </div>
    </div>
  );
}

export default LandingPage;
