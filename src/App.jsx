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
import DoctorEdit from './components/doctor/EditScreen';
import TestEdit from './components/labs/EditTests';
import DoctorBookings from './components/doctor/DoctorBookings';
import AccountDetails from './components/common/AccountDetails';
import TestBookings from './components/labs/TestBookings';

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
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role,setRole]=useState('');
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
        setRole(data.hosp.role)
        localStorage.setItem('role', data.hosp.role);
        localStorage.setItem('hospId', data.hosp._id);
        fetchData(data.hosp.role, data.hosp._id);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      localStorage.removeItem('hospitalToken');
      localStorage.removeItem('role');
      localStorage.removeItem('hospId');
      setHospitalToken(null);
      setMobile(true);
    }
  };

  const fetchData = async (userRole, hospitalId) => {
    try {
      setLoading(true);
      let url = userRole === 'hospital'
        ? `https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`
        : `https://server.bookmyappointments.in/api/bma/user/labs/${hospitalId}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        if (userRole === 'hospital') {
          setDoctors(data.hospital.doctors);
        } else {
          setTests(data.hospital.tests);
        }
        setError(null);
      } else {
        throw new Error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch data. Please try again later.");
      if (userRole === 'hospital') {
        setDoctors([]);
      } else {
        setTests([]);
      }
    } finally {
      setLoading(false);
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
        <Route path="/" element={<LandingPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} searchQuery={searchQuery} doctors={doctors} tests={tests}role={role} />} />
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
      {otp && (
        <OtpScreen 
          toggleLogin={toggleLogin} 
          toggleOtp={toggleOtp} 
          mobileNumber={mobileNumber} 
          toggleSignup={toggleSignup} 
          fetchData2={fetchHospitalData} 
          fetchData={fetchData}
        />
      )}
      {reg && (
        <OtpRegister 
          toggleLogin={toggleLogin} 
          toggleReg={toggleReg} 
          mobileNumber={mobileNumber} 
          toggleSignup={toggleSignup} 
          fetchData2={fetchHospitalData} 
          fetchData={fetchData}
        />
      )}
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