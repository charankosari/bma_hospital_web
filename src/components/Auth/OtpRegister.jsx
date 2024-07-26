import React, { useRef, useState } from 'react';
import './OtpScreen.css';
import { useNavigate, useLocation } from 'react-router-dom';

function OtpRegister({ toggleLogin, toggleReg, mobileNumber }) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [loading, setLoading] = useState(false);
  const number = Number(mobileNumber); // Ensure mobileNumber is parsed as integer
  console.log(number)

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) { // Ensure input is a digit
      setOtp(prevOtp => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubm=()=>{
    navigate('/');
        toggleLogin();
        toggleReg();
  }
  const handleSubmit = async () => {
    setLoading(true);
    const otpNumber = Number(otp.join('')); // Convert OTP digits to integer
    console.log(otpNumber)

    // Log the data to inspect it
    console.log('Submitting OTP:', otpNumber);
    console.log('Submitting Mobile Number:', number);
   const payload = {  number, otp: otpNumber };
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/verifyregisterotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        localStorage.setItem('jwtToken', data.jwtToken);
        navigate('/');
        toggleLogin();
        toggleReg();
      } else {
        alert(data.message || 'Invalid response from server');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp">
        <h3>We have sent you the code to your mobile number</h3>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={el => inputRefs.current[index] = el}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
              value={digit}
              disabled={loading}
            />
          ))}
        </div>
        <button className="verify-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Verifying...' : 'VERIFY'}
        </button>
      </div>
    </div>
  );
}

export default OtpRegister;