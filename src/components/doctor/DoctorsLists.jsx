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
const DoctorList = ({ searchQuery }) => {
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospid, setHospid] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    study: [],
    specialization: "",
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
      let url = `https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setAllDoctors(data.hospital.doctors);
        setFilteredDoctors(data.hospital.doctors);
        setError(null);
      } else {
        throw new Error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch data. Please try again later.");
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const filtered = allDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, allDoctors]);

  const handleAddDoctor = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setNewDoctor({
      name: "",
      study: [],
      specialization: "",
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
    setNewDoctor((prevDoctor) => ({ ...prevDoctor, [name]: value }));
  };

  const handleQualificationChange = (event) => {
    const { value, checked } = event.target;
    setNewDoctor((prevDoctor) => ({
      ...prevDoctor,
      study: checked
        ? [...prevDoctor.study, value]
        : prevDoctor.study.filter((qualification) => qualification !== value),
    }));
  };
  const handleCancelImage = () => {
    setImageFile(null);
    setUploadError(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const MAX_SIZE_MB = 2;

    if (file.size / (1024 * 1024) > MAX_SIZE_MB) {
      setUploadError("Image size should be less than 2 MB.");
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
    if(newDoctor.imageUrl||newDoctor.name||newDoctor.specialization||newDoctor.appointmentDuration||newDoctor.consultancyFee||newDoctor.eveningStartTime||newDoctor.eveningEndTime||newDoctor.morningEndTime||newDoctor.morningStartTime||newDoctor.noOfDays ==='')
    {
      alert('Fill all the details');
      handleModalClose();
    }
    try {
      const token = localStorage.getItem("hospitalToken");
      let imageUrl = newDoctor.imageUrl;
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

      const newDoctorData = {
        name: newDoctor.name,
        study: newDoctor.study.join(", "),
        image: imageUrl,
        specialist: newDoctor.specialization,
        price: {
          consultancyfee: parseInt(newDoctor.consultancyFee),
        },
        timings: {
          morning: [
            {
              startTime: newDoctor.morningStartTime,
              endTime: newDoctor.morningEndTime,
            },
          ],
          evening: [
            {
              startTime: newDoctor.eveningStartTime,
              endTime: newDoctor.eveningEndTime,
            },
          ],
        },
        slotTimings: parseInt(newDoctor.appointmentDuration),
        noOfDays: parseInt(newDoctor.noOfDays),
      };

      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/adddoctor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoctorData),
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        setSnackbarOpen(true);
        fetchData(userRole, hospitalId);
        handleModalClose();
      } else {
        throw new Error("Failed to add doctor");
      }
    } catch (error) {
      console.error("Failed to add doctor:", error);
      setUploadError("Failed to add doctor. Please try again later.");
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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ minHeight: "70vh", width: "100%" }}>
        <Box position="absolute" bottom={"20%"} right={16} zIndex={1}>
          <IconButton
            onClick={handleAddDoctor}
            sx={{ backgroundColor: "#2BB673", color: "white" }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {filteredDoctors.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <PersonOutlineIcon sx={{ fontSize: 100, color: "#cccccc" }} />
            <Typography variant="h6" color="textSecondary">
              No doctors are available
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} sx={{marginTop:'10px',marginBottom:'10px'}}>
            {filteredDoctors.map((doctor, index) => (
                
              <Card
                key={index}
                sx={{
                  display: "flex",
                  padding: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  cursor:'pointer'
                }}
                onClick={()=>{ navigate(`/doctor/${doctor._id}`,{state:doctor})}}
              >
                 <CardMedia
                  component="img"
                  sx={{ width: 100, borderRadius: 2 }}
                  image={doctor.image}
                  alt={doctor.name}
                />
                <CardContent>
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography color="textSecondary">
                    {doctor.specialist}
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
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogContent>
            {activeStep === 0 && (
              <Box>
                <TextField
                  label="Doctor Name"
                  name="name"
                  value={newDoctor.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <span style={{ marginLeft: "5px" }}>Select Study:</span>
                <FormGroup
                  row
                  sx={{
                    overflowX: "auto",
                    padding: "10px",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newDoctor.study.includes("MBBS")}
                        onChange={handleQualificationChange}
                        value="MBBS"
                        sx={{
                          color: "#2BB673",
                          "&.Mui-checked": { color: "#2BB673" },
                        }}
                      />
                    }
                    label="MBBS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newDoctor.study.includes("MD")}
                        onChange={handleQualificationChange}
                        value="MD"
                        sx={{
                          color: "#2BB673",
                          "&.Mui-checked": { color: "#2BB673" },
                        }}
                      />
                    }
                    label="MD"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newDoctor.study.includes("MS")}
                        onChange={handleQualificationChange}
                        value="MS"
                        sx={{
                          color: "#2BB673",
                          "&.Mui-checked": { color: "#2BB673" },
                        }}
                      />
                    }
                    label="MS"
                  />
                </FormGroup>
                <TextField
                  select
                  label="Specialization"
                  name="specialization"
                  value={newDoctor.specialization}
                  style={samestyle}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                </TextField>
                <TextField
                  label="Consultancy Fee"
                  name="consultancyFee"
                  value={newDoctor.consultancyFee}
                  onChange={handleInputChange}
                  fullWidth
                  style={samestyle}
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
                  value={newDoctor.morningStartTime}
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
                  value={newDoctor.morningEndTime}
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
                  value={newDoctor.eveningStartTime}
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
                  value={newDoctor.eveningEndTime}
                  onChange={handleInputChange}
                  type="time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Appointment Duration"
                  name="appointmentDuration"
                  style={samestyle}
                  value={newDoctor.appointmentDuration}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Number of Days"
                  style={samestyle}
                  name="noOfDays"
                  value={newDoctor.noOfDays}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
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
          Doctor added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default DoctorList;
