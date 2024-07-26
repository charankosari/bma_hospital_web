import React, { useState } from 'react';
import './MobileVerify.css';
import { useNavigate } from 'react-router-dom';

function MobileVerify({ toggleMobile, toggleLogin, toggleOtp, setMobileNumber, mobileNumber, toggleSignup, setHospitalToken, setHospid }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: mobileNumber }),
      });

      const data = await response.json();
      console.log(data);
      sessionStorage.setItem('hospid', data.hospid); 
      if (response.ok) {
        setHospitalToken(data.token);
        setHospid(data.hospid);
        localStorage.setItem('hospitalToken', data.token);
        toggleMobile();
        toggleOtp();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to send OTP, please try again");
    } finally {
      setLoading(false);
    }
  };

  const signup = () => {
    toggleSignup();
    toggleMobile();
  };

  return (
    <div className="mobile-verify-overlay">
      <div className="mobile-verify">
        <h3>Enter Mobile Number</h3>
        <input
          type="number"
          placeholder="Mobile Number"
          value={mobileNumber || ''} 
          onChange={(e) => setMobileNumber(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSendOtp} disabled={loading}>
          {loading ? 'Sending...' : 'Proceed'}
        </button>
        <div className="signup-prompt">
          Don't have an account? <span onClick={signup} className="signup-link">Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default MobileVerify;
