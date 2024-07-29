import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Container,
  IconButton,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2BB673",
    },
    background: {
      default: "#fff",
    },
  },
});

const AccountDetails = () => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const token = localStorage.getItem("hospitalToken");
        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/hospital/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setData(result);
          setName(result.hosp.hospitalName);
          setEmail(result.hosp.email);
          setMobileNumber(result.hosp.number.toString());
        } else {
          console.error("Failed to fetch hospital details:", result);
        }
      } catch (error) {
        console.error("Error fetching hospital details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, []);

  const handleChangeNumber = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewMobileNumber("");
    setOtp("");
    setStep(1);
  };

  const handleSendOtp = async () => {
    try {
      setIsLoadingSendOtp(true);
      const token = localStorage.getItem("hospitalToken");
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/verifynumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ number: parseInt(newMobileNumber) }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent successfully!");
        setStep(2);
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoadingVerifyOtp(true);
      const token = localStorage.getItem("hospitalToken");
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/numberupdate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hospid: data.hosp._id,
            number: newMobileNumber,
            otp: parseInt(otp),
          }),
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        alert("Mobile number updated successfully!");
        setMobileNumber(newMobileNumber);
        handleCloseModal();
      } else {
        alert("Failed to verify OTP or update mobile number");
      }
    } catch (error) {
      console.error("Error verifying OTP and updating mobile number:", error);
    } finally {
      setIsLoadingVerifyOtp(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("hospitalToken");
      const updatedFields = {};

      if (name !== data.hosp.hospitalName) {
        updatedFields.hospitalName = name;
      }

      if (email !== data.hosp.email) {
        updatedFields.email = email;
      }

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes to update.");
        return;
      }
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/me/profileupdate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile:", result);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box component={Paper} padding={3} mt={3}>
          <Box marginBottom={3}>
            <TextField
              label="Hospital Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box marginBottom={3}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box marginBottom={3} display="flex" alignItems="center">
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              value={mobileNumber}
              disabled
            />
            <Button color="primary" onClick={handleChangeNumber}>
              Change
            </Button>
          </Box>
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
            Update
          </Button>
        </Box>

        <Modal
          open={modalVisible}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            bgcolor="background.paper"
            p={4}
            borderRadius={1}
            boxShadow={24}
            width="80%"
            maxWidth={400}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            {step === 1 ? (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  Change Mobile Number
                </Typography>
                <TextField
                  label="New Mobile Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newMobileNumber}
                  onChange={(e) => setNewMobileNumber(e.target.value)}
                  type="number"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendOtp}
                  fullWidth
                  disabled={isLoadingSendOtp}
                  sx={{ mt: 2 }}
                >
                  {isLoadingSendOtp ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  Enter OTP
                </Typography>
                <TextField
                  label="OTP"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="number"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyOtp}
                  fullWidth
                  disabled={isLoadingVerifyOtp}
                  sx={{ mt: 2 }}
                >
                  {isLoadingVerifyOtp ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default AccountDetails;
