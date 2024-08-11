import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Avatar,
  IconButton,
  ThemeProvider,
  Snackbar,
  Dialog,
  DialogActions,
  createTheme,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Menu,
  useMediaQuery,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Delete as DeleteIcon, AddPhotoAlternate as AddPhotoIcon,Menu as MenuIcon } from "@mui/icons-material";

const EditScreen = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [study, setStudy] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [consultancyFee, setConsultancyFee] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manageSlotsDialogOpen, setManageSlotsDialogOpen] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [date, setDate] = useState("");
  const [morningStartTime, setMorningStartTime] = useState("");
  const [morningEndTime, setMorningEndTime] = useState("");
  const [eveningStartTime, setEveningStartTime] = useState("");
  const [eveningEndTime, setEveningEndTime] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [slotTimings, setSlotTimings] = useState("");
  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const jwtToken = localStorage.getItem("hospitalToken"); 
  const validateFields = () => {
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeFormat.test(morningStartTime) ||
        !timeFormat.test(morningEndTime) ||
        !timeFormat.test(eveningStartTime) ||
        !timeFormat.test(eveningEndTime)) {
      alert('Please enter a valid time in HH:MM format.');
      return false;
    }
    const morningStart = new Date(`1970-01-01T${morningStartTime}:00`);
    const morningEnd = new Date(`1970-01-01T${morningEndTime}:00`);
    const eveningStart = new Date(`1970-01-01T${eveningStartTime}:00`);
    const eveningEnd = new Date(`1970-01-01T${eveningEndTime}:00`);
    if (morningStartTime.trim() === "" ||
        morningEndTime.trim() === "" ||
        eveningStartTime.trim() === "" ||
        eveningEndTime.trim() === "" ||
        date.trim() === "" ||
        isNaN(parseInt(noOfDays, 10)) ||
        isNaN(parseInt(slotTimings, 10))) {
      alert('Please fill out all required fields.');
      return false;
    }
    if (morningStart.getTime() === morningEnd.getTime()) {
      alert('Morning Start Time and End Time cannot be the same.');
      return false;
    }
    if (morningStart > morningEnd) {
      alert('Morning Start Time should be earlier than Morning End Time.');
      return false;
    }
    if (eveningStart.getTime() === eveningEnd.getTime()) {
      alert('Evening Start Time and End Time cannot be the same.');
      return false;
    }
    if (eveningStart > eveningEnd) {
      alert('Evening Start Time should be earlier than Evening End Time.');
      return false;
    }
    if (eveningStart <= morningEnd) {
      alert('Evening Start Time should be later than Morning End Time.');
      return false;
    }
    if (morningEnd.getTime() === eveningStart.getTime()) {
      alert('Morning End Time and Evening Start Time cannot be the same.');
      return false;
    }

    return true;
  };
  
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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/singledoc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ doctorid: id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch doctor details");
      }

      const updatedDoctor = await response.json();
      setDoctor(updatedDoctor.doctor);
      setName(updatedDoctor.doctor.name);
      setStudy(updatedDoctor.doctor.study);
      setSpecialist(updatedDoctor.doctor.specialist);
      setConsultancyFee(updatedDoctor.doctor.price.consultancyfee);
      setImageUrl(updatedDoctor.doctor.image);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch doctor details");
      setLoading(false);
    }
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleMenuItemClick = (option) => {
    setAnchorEl(null);
    if (option === "Add Slots") {
      setManageSlotsDialogOpen(true);
    } else if (option === "Delete Doctor") {
      setDialogOpen(true);
    }
    else if (option === "Show Bookings"){
      navigate(`/doctor-bookings/${doctor._id}`)
    }
  };
  const handleSaveDoctorDetails = async () => {
    setLoading(true);
    let hasChanges = false;
    const payload = { docid: id };
  
    if (name !== doctor.name) {
      payload.name = name;
      hasChanges = true;
    }
    if (study !== doctor.study) {
      payload.study = study;
      hasChanges = true;
    }
    if (specialist !== doctor.specialist) {
      payload.specialist = specialist;
      hasChanges = true;
    }
    if (consultancyFee !== doctor.price.consultancyfee) {
      payload.price = { consultancyfee: consultancyFee };
      hasChanges = true;
    }
    if (!hasChanges) {
      alert('No details have been changed.');
      setLoading(false);
      return; 
    }
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/editdoctor",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update doctor details");
      }
      setSnackbarMessage("Doctor details updated successfully!");
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to update doctor details");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/profileupload",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to upload image");
      }

      const payload = {
        docid: id,
        image: data.url,
      };

      await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/editdoctor",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setImageUrl(data.url);
      setSnackbarMessage("Image uploaded successfully!");
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Image upload failed!");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    try {
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/deleteDoctor/${doctor.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }
      setSnackbarMessage("Doctor deleted successfully!");
      setSnackbarOpen(true);
      navigate("/");
      window.location.reload();
      
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to delete doctor");
      setSnackbarOpen(true);
    }
  };

  const handleDialogClose = (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      handleDeleteDoctor();
    }
  };

  const handleManageSlotsDialogClose = () => {
    setManageSlotsDialogOpen(false);
    setSlotTimings('');
    setNoOfDays('');
    setEveningEndTime('');
    setEveningStartTime('');
    setMorningEndTime('');
    setMorningStartTime('');
    setDate('');
  };

  const handleSaveSlots = async () => {
      if (!validateFields()) {
        return;
      }
    setSlotLoading(true);

    const payload = {
      date,
      doctorId: id,
      morning: {
        startTime: morningStartTime,
        endTime: morningEndTime,
      },
      evening: {
        startTime: eveningStartTime,
        endTime: eveningEndTime,
      },
      noOfDays: parseInt(noOfDays),
      slotTimings: parseInt(slotTimings),
    };
    console.log(payload)

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/me/addmoresessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save slots");
      }

      setSnackbarMessage("Slots saved successfully!");
      setSnackbarOpen(true);
      setSlotLoading(false);
      setManageSlotsDialogOpen(false);
     
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to save slots");
      setSnackbarOpen(true);
      setSlotLoading(false);
    
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box p={isMobile ? 2 : 4} maxWidth={isMobile ? '100%' : '80%'} mx="auto" mt={4}>
      <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4">Edit Doctor</Typography>
          </Grid>
          {/* <Grid item>
            <IconButton
              aria-label="menu"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleMenuItemClick("Add Slots")}>
              Add Slots
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("Delete Doctor")} sx={{color:'red'}}>
                Delete Doctor 
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("Show Bookings")}>
                Show Bookings
              </MenuItem>
            </Menu>
          </Grid> */}
        </Grid>

        <Box display="flex" mb={4} flexDirection='row' mt={4}>
          <Avatar src={imageUrl} alt={name} sx={{ width: 120, height: 120 }} />
          
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
           <label htmlFor="icon-button-file" style={{marginTop:'80px'}}>
            <IconButton color="primary" aria-label="upload picture" component="span">
              <AddPhotoIcon /> <span style={{fontSize:'12px'}}>change image</span>
            </IconButton>
          </label>
         
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Study"
              value={study}
              onChange={(e) => setStudy(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Specialist"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Consultancy Fee"
              value={consultancyFee}
              onChange={(e) => setConsultancyFee(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box display="flex"  mt={4} gap={4}>
          <Button variant="contained" color="primary" sx={{color:'white'}} onClick={handleSaveDoctorDetails}>
            Save Details
          </Button>
          <Button variant="contained" color="primary"  sx={{color:'white'}} onClick={() => handleMenuItemClick("Add Slots")}>
            Add slots
          </Button>
          <Button variant="contained" color="primary"  sx={{color:'white'}} onClick={() => handleMenuItemClick("Show Bookings")}>
          Show Bookings
          </Button>
          <Button
  variant="contained"
  color="primary"
  sx={{
    backgroundColor: 'red',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkred',
    },
  }}
  onClick={() => handleMenuItemClick("Delete Doctor")}
>
  Delete Doctor
</Button>

         
        </Box>
       
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Delete Doctor</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this doctor?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
            <Button onClick={() => handleDialogClose(true)} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={manageSlotsDialogOpen} onClose={handleManageSlotsDialogClose}>
          <DialogTitle>Add Slots</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill out the details to add slots for the doctor.
            </DialogContentText>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Morning Start Time"
              type="time"
              value={morningStartTime}
              onChange={(e) => setMorningStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Morning End Time"
              type="time"
              value={morningEndTime}
              onChange={(e) => setMorningEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Evening Start Time"
              type="time"
              value={eveningStartTime}
              onChange={(e) => setEveningStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Evening End Time"
              type="time"
              value={eveningEndTime}
              onChange={(e) => setEveningEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Number of Days"
              type="number"
              value={noOfDays}
              onChange={(e) => setNoOfDays(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Slot Timings (minutes)"
              type="number"
              value={slotTimings}
              onChange={(e) => setSlotTimings(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleManageSlotsDialogClose}>Cancel</Button>
            <Button onClick={handleSaveSlots} color="primary" disabled={slotLoading}>
              {slotLoading ? <CircularProgress size={24} /> : "Save Slots"}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

export default EditScreen;
