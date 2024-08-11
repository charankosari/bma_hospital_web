import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtpScreen.css';

function OtpRegister({ toggleLogin, toggleReg, toggleSignup, mobileNumber,fetchData,fetchData2 }) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) { 
      setOtp(prevOtp => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (e.target.value === '') {
      setOtp(prevOtp => {
        const newOtp = [...prevOtp];
        newOtp[index] = '';
        return newOtp;
      });
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const otpNumber = Number(otp.join('')); 

    const registrationData = sessionStorage.getItem('registrationData');
    const payload = JSON.parse(registrationData);
    const updatedPayload = { ...payload, otp:otpNumber };
    console.log(updatedPayload);
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/verifyregisterotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPayload),
      });
      const data = await response.json();

      if (response.status === 201) {
        sessionStorage.removeItem('registrationData'); 
        localStorage.setItem('hospitalToken', data.jwtToken);
        await fetchData2(data.jwtToken);
        await fetchData(data.hosp.role,data.hosp._id);
        toggleReg();
        toggleSignup();
        window.location.reload()
      } else {
        alert(data.error || 'Registration failed');
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
