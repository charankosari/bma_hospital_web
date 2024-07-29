import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/common/LandingPage';
import Navbar from './components/common/Navbar';
import MobileVerify from './components/Auth/MobileVerify';
import Signup from './components/Auth/Signup';
import OtpScreen from './components/Auth/OtpScreen';
import OtpRegister from './components/Auth/OtpRegister';
import TermsAndConditions from './components/common/TermsAndConditions';
import HelpAndSupport from './components/common/HelpAndSupport';
import PrivacyAndPolicy from './components/common/PrivacyAndPolicy';
import DoctorEdit from './components/doctor/EditScreen'
import TestEdit from './components/labs/EditTests'
import DoctorBookings from './components/doctor/DoctorBookings'
import AccountDetails from './components/common/AccountDetails';
import TestBookings from './components/labs/TestBookings'
function App() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(true);
  const [otp, setOtp] = useState(false);
  const [reg, setReg] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [hospitalToken, setHospitalToken] = useState(null);
  const [hospid, setHospid] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const toggleLogin = () => setLogin((prev) => !prev);
  const toggleMobile = () => setMobile((prev) => !prev);
  const toggleOtp = () => setOtp((prev) => !prev);
  const toggleReg = () => setReg((prev) => !prev);
  const toggleSignup = () => setShowSignup((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem('hospitalToken');
    setHospitalToken(token);
    if (token) {
      fetchHospitalData(token);
    } else {
      setMobile(true);
    }
  }, []);

  const fetchHospitalData = async (token) => {
    try {
      const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 200 && data) {
        setHospitalData(data);
        setHospid(data.id); 
        localStorage.setItem('role',data.hosp.role)
        localStorage.setItem('hospId',data.hosp._id)
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      localStorage.removeItem('hospitalToken');
      localStorage.removeItem('role');
      localStorage.removeItem('hospId')
      setHospitalToken(null);
      setMobile(true);
    }
  };

  return (
    <BrowserRouter>
      <Navbar 
        mobile={mobile} 
        setMobile={setMobile} 
        toggleLogin={toggleLogin} 
        setSearchQuery={setSearchQuery} 
      />
      <Routes>
        <Route path="/" element={<LandingPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} searchQuery={searchQuery}  />} />
        <Route path="/account-details" element={<AccountDetails login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}  />} />
        <Route path="/doctor-bookings/:id" element={<DoctorBookings login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}  />} />
        <Route path="/test-bookings/:id" element={<TestBookings login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}  />} />
        <Route path="/terms-conditions" element={<TermsAndConditions login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/privacy-policy" element={<PrivacyAndPolicy login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/help-support" element={<HelpAndSupport login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/doctor/:id" element={<DoctorEdit login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/test/:id" element={<TestEdit login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />

      </Routes>
      {!hospitalToken && mobile && (
        <MobileVerify 
          toggleMobile={toggleMobile} 
          toggleLogin={toggleLogin} 
          toggleOtp={toggleOtp} 
          setMobileNumber={setMobileNumber} 
          mobileNumber={mobileNumber} 
          toggleSignup={toggleSignup}
          setHospitalToken={setHospitalToken}
          setHospid={setHospid}
        />
      )}
      {otp && <OtpScreen toggleLogin={toggleLogin} toggleOtp={toggleOtp} mobileNumber={mobileNumber} toggleSignup={toggleSignup}/>}
      {reg && <OtpRegister toggleLogin={toggleLogin} toggleReg={toggleReg} mobileNumber={mobileNumber} toggleSignup={toggleSignup} />}
      {showSignup && (
        <Signup 
          toggleReg={toggleReg} 
          mobileNumber={mobileNumber} 
          setMobileNumber={setMobileNumber} 
          toggleMobile={toggleMobile} 
          toggleLogin={toggleLogin} 
          toggleSignup={toggleSignup}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
