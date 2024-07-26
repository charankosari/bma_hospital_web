import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Box, Modal, CircularProgress, Card, CardContent, CardActions, Grid
} from '@mui/material';
import axios from 'axios';
import Footer from '../common/Footer';

const Profile = ({ login, toggleLogin, mobile, setMobile }) => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [numberModalVisible, setNumberModalVisible] = useState(false);
  const [initialDetails, setInitialDetails] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
          throw new Error('JWT token not found in localStorage');
        }
        const response = await axios.get('https://server.bookmyappointments.in/api/bma/me', {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        setUserDetails(response.data.user);
        setInitialDetails(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    const updatedFields = {};
    for (const key in userDetails) {
      if (userDetails[key] !== initialDetails[key]) {
        updatedFields[key] = userDetails[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes were made to the profile.");
      return;
    }

    setLoading(true);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.put(
        'https://server.bookmyappointments.in/api/bma/me/profileupdate',
        updatedFields,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setInitialDetails(response.data.user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!newNumber) {
      alert("Please enter a new mobile number.");
      return;
    }

    setLoading(true);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.post(
        "https://server.bookmyappointments.in/api/bma/verifynumber",
        { number: newNumber },
        { headers: { Authorization: `Bearer ${jwtToken}`, "Content-Type": "application/json" } }
      );
      if (response.data.message === "OTP sent successfully") {
        setOtpSent(true);
        alert("OTP sent to the new mobile number.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.put(
        "https://server.bookmyappointments.in/api/bma/numberupdate",
        { otp: parseInt(otp), number: newNumber, userid: userDetails._id },
        { headers: { Authorization: `Bearer ${jwtToken}`, "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setInitialDetails({ ...initialDetails, number: newNumber });
        setUserDetails((prevDetails) => ({ ...prevDetails, number: newNumber }));
        setNewNumber('');
        setOtp('');
        setOtpSent(false); // Reset OTP sent status
        setNumberModalVisible(false);
        alert("Mobile number updated successfully!");
      } else {
        alert("Failed to verify OTP or update mobile number.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Account Information</Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  id="email"
                  InputLabelProps={{ shrink: true }}
                  value={userDetails.email || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mobile"
                  id="mobile"
                  value={otpSent ? newNumber : userDetails.number || ''}
                  InputLabelProps={{ shrink: true }}
                  onClick={() => setNumberModalVisible(true)}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: otpSent }} // Disable editing when OTP is sent
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Typography variant="h4" gutterBottom>Personal Information</Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  id="name"
                  value={userDetails.name || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Age"
                  id="age"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your age"
                  value={userDetails.age || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Weight"
                  id="weight"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your weight"
                  value={userDetails.weight || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Height"
                  id="height"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter your height"
                  value={userDetails.height || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </CardActions>
        </Card>
      </Container>
      <Footer />
      <Modal open={numberModalVisible} onClose={() => setNumberModalVisible(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>Change Mobile Number</Typography>
          <TextField
            label="New Mobile Number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            fullWidth
            margin="normal"
            disabled={otpSent} // Disable new number input after OTP is sent
          />
          {otpSent && (
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={otpSent ? handleVerifyOtp : handleSendOtp} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : otpSent ? "Verify OTP" : "Send OTP"}
            </Button>
            <Button onClick={() => setNumberModalVisible(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;