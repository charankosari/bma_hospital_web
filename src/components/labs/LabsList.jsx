import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  Snackbar,
  Alert,
  Button,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  Dialog,
  DialogTitle,
  createTheme,
  DialogContent,
  DialogActions,
  ThemeProvider,
} from "@mui/material";
import {
  Add as AddIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2BB673",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2BB673",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#2BB673",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#2BB673",
          "&.Mui-checked": {
            color: "#2BB673",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2BB673",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2BB673",
          },
          "& .Mui-focused .MuiInputLabel-root": {
            color: "#2BB673",
          },
        },
      },
    },
  },
});
const LabsList = ({ searchQuery }) => {
  const [filteredTests, setfilteredTests] = useState([]);
  const [allTests, setallTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospid, setHospid] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTest, setnewTest] = useState({
    name: "",
    consultancyFee: "",
    morningStartTime: "",
    morningEndTime: "",
    eveningStartTime: "",
    eveningEndTime: "",
    appointmentDuration: "",
    noOfDays: "",
    imageUrl: "",
  });
  const userRole = localStorage.getItem("role");
  const hospitalId = localStorage.getItem("hospId");
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const samestyle = {
    mb: 2,
    fontSize: 18,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
    "& .MuiInputLabel-root": {
      color: "black",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
    },
  };
  useEffect(() => {
    async function fetchRoleAndData() {
      try {
        setHospid(hospitalId);
        if (userRole && hospitalId) {
          fetchData(userRole, hospitalId);
        } else {
          throw new Error("Role or Hospital ID is missing");
        }
      } catch (error) {
        console.error("Failed to fetch role and hospital ID:", error);
        setError("Failed to fetch role and hospital ID.");
        setLoading(false);
      }
    }
    fetchRoleAndData();
  }, []);

  const fetchData = async (userRole, hospitalId) => {
    try {
      setLoading(true);
      let url = `https://server.bookmyappointments.in/api/bma/user/labs/${hospitalId}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setallTests(data.hospital.tests);
        setfilteredTests(data.hospital.tests);
        setError(null);
      } else {
        throw new Error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch data. Please try again later.");
      setfilteredTests([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const filtered = allTests.filter(

      (test) =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.code.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    setfilteredTests(filtered);
  }, [searchQuery, allTests]);

  const handleAddTest = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setnewTest({
      name: "",
      consultancyFee: "",
      morningStartTime: "",
      morningEndTime: "",
      eveningStartTime: "",
      eveningEndTime: "",
      appointmentDuration: "",
      noOfDays: "",
      imageUrl: "",
    });
    setImageFile(null);
    setUploadError(null);
    setActiveStep(0);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setnewTest((prevTest) => ({ ...prevTest, [name]: value }));
  };


  const handleCancelImage = () => {
    setImageFile(null);
    setUploadError(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setUploadError("Image size should be less than 2 MB.");
      alert("File size exceeds 2 MB. Please upload a smaller file.");
      return;
    }
   

    setImageFile(file);
    setUploadError(null);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const isAnyFieldEmpty = Object.keys(newTest).some(field => 
      field !== 'imageUrl' && (newTest[field] === '' || newTest[field] === undefined || newTest[field] === null)
    );
  
    if (isAnyFieldEmpty || imageFile === null) {
      alert('Fill all the details');
      return; 
    }
    const morningStart = new Date(`1970-01-01T${newTest.morningStartTime}:00`);
    const morningEnd = new Date(`1970-01-01T${newTest.morningEndTime}:00`);
    const eveningStart = new Date(`1970-01-01T${newTest.eveningStartTime}:00`);
    const eveningEnd = new Date(`1970-01-01T${newTest.eveningEndTime}:00`);
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeFormat.test(newTest.morningStartTime) ||
        !timeFormat.test(newTest.morningEndTime) ||
        !timeFormat.test(newTest.eveningStartTime) ||
        !timeFormat.test(newTest.eveningEndTime)) {
      alert('Please enter a valid time in HH:MM format.');
      return;
    }
  
    if (morningStart.getTime() === morningEnd.getTime()) {
      alert('Morning Start Time and End Time cannot be the same.');
      return;
    }
  
    if (morningStart > morningEnd) {
      alert('Morning Start Time should be earlier than Morning End Time.');
      return;
    }
  
    if (eveningStart.getTime() === eveningEnd.getTime()) {
      alert('Evening Start Time and End Time cannot be the same.');
      return;
    }
  
    if (eveningStart > eveningEnd) {
      alert('Evening Start Time should be earlier than Evening End Time.');
      return;
    }
  
    if (eveningStart <= morningEnd) {
      alert('Evening Start Time should be later than Morning End Time.');
      return;
    }
  
    if (morningEnd.getTime() === eveningStart.getTime()) {
      alert('Morning End Time and Evening Start Time cannot be the same.');
      return;
    }
    try {
      const token = localStorage.getItem("hospitalToken");
      let imageUrl = newTest.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/hospital/profileupload",
          {
            method: "POST",

            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok && data.url) {
          imageUrl = data.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const newTestData = {
        name: newTest.name,
        image: imageUrl,
        price: {
          consultancyfee: parseInt(newTest.consultancyFee),
        },
        timings: {
          morning: [
            {
              startTime: newTest.morningStartTime,
              endTime: newTest.morningEndTime,
            },
          ],
          evening: [
            {
              startTime: newTest.eveningStartTime,
              endTime: newTest.eveningEndTime,
            },
          ],
        },
        slotTimings: parseInt(newTest.appointmentDuration),
        noOfDays: parseInt(newTest.noOfDays),
      };

      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/addtest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTestData),
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        setSnackbarOpen(true);
        fetchData(userRole, hospitalId);
        handleModalClose();
      } else {
        throw new Error("Failed to add test");
      }
    } catch (error) {
      console.error("Failed to add test:", error);
      setUploadError("Failed to add test. Please try again later.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ minHeight: "70vh", width: "100%" }}>
        <Box position="absolute" bottom={"20%"} right={16} zIndex={1}>
          <IconButton
            onClick={handleAddTest}
            sx={{ backgroundColor: "#2BB673", color: "white" }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {filteredTests.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight='70vh'
          >
            <PersonOutlineIcon sx={{ fontSize: 100, color: "#cccccc" }} />
            <Typography variant="h6" color="textSecondary">
              No test are available
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} sx={{marginTop:'10px',marginBottom:'10px'}}>
            {filteredTests.map((test, index) => (
                
              <Card
                key={index}
                sx={{
                  display: "flex",
                  padding: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  cursor:'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2BB673',
                    '& .MuiTypography-root': {
                      color: '#fff',
                    },
                  },
                }}
                onClick={()=>{ navigate(`/test/${test._id}`,{state:test})}}
              >
                 <CardMedia
                  component="img"
                  sx={{ width: 100, borderRadius: 2 }}
                  image={test.image}
                  alt={test.name}
                />
                <CardContent>
                  <Typography variant="h6">{test.name}</Typography>
                  <Typography color="textSecondary">
                    {test.specialist}
                  </Typography>
                </CardContent>
               
              </Card>
            ))}
          </Box>
        )}
        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Test</DialogTitle>
          <DialogContent>
            {activeStep === 0 && (
              <Box>
                <TextField
                  label="Test Name"
                  name="name"
                  value={newTest.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              
              
                <TextField
                  label="Consultancy Fee"
                  name="consultancyFee"
                  value={newTest.consultancyFee}
                  onChange={handleInputChange}
                  fullWidth
                  style={samestyle}
                  margin="normal"
                />
                  <TextField
                  label="Appointment Duration"
                  name="appointmentDuration"
                  style={samestyle}
                  value={newTest.appointmentDuration}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Number of Days"
                  style={samestyle}
                  name="noOfDays"
                  value={newTest.noOfDays}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                {!imageFile ? (
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ marginTop: "10px" }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                ) : (
                  <Box mt={2} display="flex" alignItems="center">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        marginRight: "16px",
                      }}
                    />
                    <IconButton onClick={handleCancelImage}>
                    <RxCross2 />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
            {activeStep === 1 && (
              <Box>
                <TextField
                  label="Morning Start Time"
                  name="morningStartTime"
                  value={newTest.morningStartTime}
                  onChange={handleInputChange}
                  style={samestyle}
                  type="time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Morning End Time"
                  name="morningEndTime"
                  value={newTest.morningEndTime}
                  onChange={handleInputChange}
                  type="time"
                  style={samestyle}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Evening Start Time"
                  name="eveningStartTime"
                  style={samestyle}
                  value={newTest.eveningStartTime}
                  onChange={handleInputChange}
                  type="time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Evening End Time"
                  name="eveningEndTime"
                  style={samestyle}
                  value={newTest.eveningEndTime}
                  onChange={handleInputChange}
                  type="time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="secondary">
              Cancel
            </Button>
            {activeStep !== 0 && (
              <Button onClick={handleBack} color="primary">
                Back
              </Button>
            )}
            {activeStep === 0 && (
              <Button onClick={handleNext} color="primary">
                Next
              </Button>
            )}
            {activeStep === 1 && (
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Test added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default LabsList;
