import React, { useRef, useState, useEffect } from "react";
import "./OtpScreen.css";
import { useNavigate, useLocation } from "react-router-dom";

function OtpScreen({
  toggleLogin,
  toggleOtp,
  mobileNumber,
  fetchData,
  fetchData2,
}) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [otpno, setOtpno] = useState(Array(4).fill(""));
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
      setOtpno((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      setOtpno((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const isOtpComplete = () => otpno.every((digit) => digit !== "");

  const handleSubmit = async () => {
    if (!isOtpComplete()) {
      alert("Please enter all digits of the OTP");
      return;
    }
    setLoading(true);
    const otpNumber = Number(otpno.join(""));
    const hospid = sessionStorage.getItem("hospid");

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/verifyotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hospid, otp: otpNumber }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("hospitalToken", data.jwtToken);
        await fetchData2(data.jwtToken);
        await fetchData(data.hosp.role, data.hosp._id);
        toggleLogin();
        toggleOtp();
        fetchHospitalData(data.jwtToken);
      } else {
        alert(data.message || "Invalid response from server");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalData = async (token) => {
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 200 && data) {
        localStorage.setItem("role", data.hosp.role);
        localStorage.setItem("hospId", data.hosp._id);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      localStorage.removeItem("hospitalToken");
      localStorage.removeItem("role");
      localStorage.removeItem("hospId");
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: mobileNumber }),
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

  return (
    <div className="otp-overlay">
      <div className="otp">
        <h3>We have sent you the code to your mobile number</h3>
        <div className="otp-inputs">
          {otpno.map((digit, index) => (
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

export default OtpScreen;
