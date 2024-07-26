import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/common/LandingPage';
import Profile from './components/doctor/Profile';
import Navbar from './components/common/Navbar';
import MobileVerify from './components/Auth/MobileVerify';
import Signup from './components/Auth/Signup';
import OtpScreen from './components/Auth/OtpScreen';
import OtpRegister from './components/Auth/OtpRegister';
import TermsAndConditions from './components/common/TermsAndConditions';
import HelpAndSupport from './components/common/HelpAndSupport';

function App() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(true);
  const [otp, setOtp] = useState(false);
  const [reg, setReg] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [hospitalToken, setHospitalToken] = useState(null);
  const [hospid, setHospid] = useState(null);

  const toggleLogin = () => setLogin((prev) => !prev);
  const toggleMobile = () => setMobile((prev) => !prev);
  const toggleOtp = () => setOtp((prev) => !prev);
  const toggleReg = () => setReg((prev) => !prev);
  const toggleSignup = () => setShowSignup((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem('hospitalToken');
    setHospitalToken(token);
    if (!token) {
      setMobile(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar 
        mobile={mobile} 
        setMobile={setMobile} 
        toggleLogin={toggleLogin} 
      />
      <Routes>
        <Route path="/" element={<LandingPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/profile" element={<Profile login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/terms-conditions" element={<TermsAndConditions login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path="/help-support" element={<HelpAndSupport login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
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
      {otp && <OtpScreen toggleLogin={toggleLogin} toggleOtp={toggleOtp} mobileNumber={mobileNumber} />}
      {reg && <OtpRegister toggleLogin={toggleLogin} toggleReg={toggleReg} mobileNumber={mobileNumber} />}
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
