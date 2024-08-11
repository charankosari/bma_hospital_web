import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const steps = ["Basic Info", "Address Info", "Upload Image & Set Location"];

function RegisterScreen({ toggleMobile, toggleSignup, toggleReg }) {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(17.38714);
  const [longitude, setLongitude] = useState(78.491684);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("hospital");
  const [openModal, setOpenModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: ["places"],
  });
  const login = () => {
    toggleSignup();
    toggleMobile();
  };
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

  const autocompleteRef = useRef(null); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    if (activeStep === steps.length - 1) {
      setOpenModal(true);
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleRegister();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    let imageUrl = "";

    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/hospital/profileupload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (response.status !== 200) {
          throw new Error(data.error || "Failed to upload image");
        }
        imageUrl = data.url;
      }

      const body = {
        hospitalName: name,
        address: {
          hospitalAddress: address,
          pincode,
          city,
          latitude,
          longitude,
        },
        number: Number(phoneNumber),
        email,
        image: imageUrl,
        role,
      };

      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        sessionStorage.setItem("registrationData", JSON.stringify(body));
        toggleReg();
        toggleSignup();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to register, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePlaceSelected = (place) => {
    setLatitude(place.geometry.location.lat());
    setLongitude(place.geometry.location.lng());
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });

    useEffect(() => {
      map.setView([latitude, longitude], map.getZoom());
    }, [latitude, longitude, map]);

    return (
      <Marker
        position={[latitude, longitude]}
        draggable={true}
        icon={L.divIcon({
          className: "custom-icon",
          html: '<i class="fas fa-map-marker-alt fa-2x" style="color: red;"></i>',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })}
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            setLatitude(position.lat);
            setLongitude(position.lng);
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{
            color: "#2BB673",
            fontSize: { xs: "1.2rem", md: "1rem" },
          }}
        >
          Register
        </Typography>

        <form>
          {activeStep === 0 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={samestyle}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={samestyle}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/^0+/, "");
                  if (value.startsWith("+91")) {
                    value = value.substring(3);
                  }
                  if (value.length > 10) {
                    value = value.slice(value.length - 10);
                  }
                  setPhoneNumber(Number(value));
                }}
                sx={samestyle}
              />
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Register As *</FormLabel>
                <RadioGroup
                  row
                  aria-label="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      "& .MuiRadio-root": {
                        color: "black",
                      },
                      "& .Mui-checked": {
                        color: "#2BB673",
                      },
                    },
                  }}
                >
                  <FormControlLabel
                    value="hospital"
                    control={<Radio />}
                    label="Hospital"
                  />
                  <FormControlLabel
                    value="lab"
                    control={<Radio />}
                    label="Lab"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={samestyle}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="pincode"
                label="Pincode"
                name="pincode"
                autoComplete="postal-code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                sx={samestyle}
              />

              
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={samestyle}
              />
   <Box display="flex" alignItems="center" gap={2} p={1} sx={{justifyContent:'space-between'}}>
  <Typography variant="body1" sx={{ whiteSpace: 'nowrap', fontWeight: '500', color: '#333' }}>
    Pick an image (optional):
  </Typography>

  {!image ? (
    <>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          sx={{
            padding: '6px 16px',
            backgroundColor: '#2BB673',
            '&:hover': { backgroundColor: '#249d5f' },
          }}
        >
          Upload Image
        </Button>
      </label>
    </>
  ) : (
    <Box display="flex" alignItems="center" gap={1.5}>
      <img
        src={URL.createObjectURL(image)}
        alt="Uploaded"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          objectFit: 'cover',
        }}
      />
      <Button
        variant="text"
        onClick={() => setImage(null)}
        sx={{ color: 'red', minWidth: 'auto', padding: '0 8px' }}
      >
        Cancel Image
      </Button>
    </Box>
  )}
</Box>

          
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ mt: 2 }}>
          

              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={() => {
                    const place = autocompleteRef.current.getPlace();
                    handlePlaceSelected(place);
                  }}
                >
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="location"
                    label="Search Location"
                    name="location"
                    autoComplete="off"
                    sx={samestyle}
                  />
                </Autocomplete>
              )}

              <Box
                sx={{
                  height: "300px",
                  width: "100%",
                  position: "relative",
                  mt: 2,
                  mb: 2,
                }}
              >
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: "black",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{
                backgroundColor: "#2BB673",
                "&:hover": { backgroundColor: "#249d5f" },
              }}
            >
              {activeStep === steps.length - 1 ? "Register" : "Next"}
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Button>
          </Box>
        </form>
      <Typography variant="h8" style={{marginLeft:'5px',marginTop:'5px'}}>Already had an account .? <span style={{color:'#2BB673',cursor:'pointer'}} onClick={()=>{login()}}>Login</span></Typography>
      </Paper>

    </Box>
  );
}

export default RegisterScreen;
