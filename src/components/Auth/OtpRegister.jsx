import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpScreen.css";

function OtpRegister({
  toggleLogin,
  toggleReg,
  toggleSignup,
  mobileNumber,
  fetchData,
  fetchData2,
}) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setResendDisabled(true);
    setCountdown(30);

    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (e.target.value === "") {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  const handleResendOtp = async () => {
    setOtpLoading(true);
    const registrationData = sessionStorage.getItem("registrationData");
    const payload = JSON.parse(registrationData);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("OTP resent successfully");
        startCountdown();
      } else {
        alert("Failed to resend OTP");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setOtpLoading(false);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const otpNumber = Number(otp.join(""));

    const registrationData = sessionStorage.getItem("registrationData");
    const payload = JSON.parse(registrationData);
    const updatedPayload = { ...payload, otp: otpNumber };
    console.log(updatedPayload);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/verifyregisterotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        }
      );
      const data = await response.json();

      if (response.status === 201) {
        sessionStorage.removeItem("registrationData");
        localStorage.setItem("hospitalToken", data.jwtToken);
        await fetchData2(data.jwtToken);
        await fetchData(data.hosp.role, data.hosp._id);
        toggleReg();
        toggleSignup();
        window.location.reload();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Error: " + error.message);
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
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
              value={digit}
              disabled={loading}
            />
          ))}
        </div>
        <button
          className="verify-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Verifying..." : "VERIFY"}
        </button>

        <button
          className="resend-button"
          onClick={handleResendOtp}
          disabled={resendDisabled || loading}
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: resendDisabled ? "#888888" : "#007BFF",
            backgroundColor: "transparent",
            border: "none",
            cursor: resendDisabled ? "not-allowed" : "pointer",
            textDecoration: resendDisabled ? "none" : "underline",
            padding: 0,
          }}
        >
          {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default OtpRegister;
