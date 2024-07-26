import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = ({ mobile, setMobile, toggleLogin, searchQuery, setSearchQuery }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('hospitalToken');
    if (token) {
      setLogin(true);
    }

    // handleSelectCurrentLocation();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Handle search query change if needed
    }
  }, [searchQuery]);

  const handleClickOutside = (event) => {
    if (
      !event.target.closest('.dropdown') &&
      !event.target.closest('.dropdown-end')
    ) {
      setIsLocationDropdownOpen(false);
      setIsAvatarDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleVerify = () => {
    setMobile(!mobile);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if (isAvatarDropdownOpen) {
      setIsAvatarDropdownOpen(false);
    }
  };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
    if (isLocationDropdownOpen) {
      setIsLocationDropdownOpen(false);
    }
  };

  // const handleSelectCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     setLoading(true);
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setCurrentLocation({ latitude, longitude });
  //         fetchAreaName(latitude, longitude);
  //         setSelectedLocation('Current Location');
  //         localStorage.setItem('selectedLocation', 'Current Location');
  //         setIsLocationDropdownOpen(false);
  //       },
  //       (error) => {
  //         console.error('Error getting location: ', error);
  //         setLoading(false);
  //       }
  //     );
  //   } else {
  //     alert('Geolocation is not supported by this browser.');
  //     setLoading(false);
  //   }
  // };

  // const fetchAreaName = async (latitude, longitude) => {
  //   const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     if (data && data.locality) {
  //       const locality = data.locality;
  //       setAreaName(locality);
  //       setSelectedLocation(locality);
  //       localStorage.setItem('selectedLocation', locality);
  //     } else {
  //       console.error('Locality not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching area name: ', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleCitySelect = (city) => {
  //   setAreaName(city);
  //   setSelectedLocation(city);
  //   localStorage.setItem('selectedLocation', city);
  //   setIsLocationDropdownOpen(false);
  // };

  // const handleNoneSelect = () => {
  //   setAreaName('');
  //   setSelectedLocation('Select location');
  //   localStorage.removeItem('selectedLocation');
  //   setIsLocationDropdownOpen(false);
  // };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Search query: ', searchQuery);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" style={{ height: '80px', width: 'auto' }} />
        </Link>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
        </div>
        {/* <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn"
            onClick={toggleLocationDropdown}
          >
            <div style={{ display: 'flex', marginRight: '-15px' }}>
              <FaLocationDot className="location-icon" />
              <div className="location-title">{selectedLocation || 'Select location'}</div>
              <FaChevronDown className="chevron-icon" />
            </div>
          </div>
          {isLocationDropdownOpen && (
            <div className="location-dropdown">
              <p onClick={handleSelectCurrentLocation}>
                {loading ? 'Loading...' : 'Select Current Location'}
              </p>
              <p onClick={handleNoneSelect}>None</p>
              <p onClick={() => handleCitySelect('Gachibowli')}>Gachibowli</p>
              <p onClick={() => handleCitySelect('Banjara Hills')}>Banjara Hills</p>
              <p onClick={() => handleCitySelect('Hyderabad')}>Hyderabad</p>
              <p onClick={() => handleCitySelect('Dulapally')}>Dulapally</p>
              <p onClick={() => handleCitySelect('Secunderabad')}>Secunderabad</p>
              <p onClick={() => handleCitySelect('Doolapally')}>Doolapally</p>
            </div>
          )}
        </div> */}
      </div>
      {login ? (
        <div className="dropdown-end">
          <div role="button" className="avatar" onClick={toggleAvatarDropdown}>
            <Avatar name="User" round={true} size="40" />
          </div>
          {isAvatarDropdownOpen && (
            <div className="menu-dropdown">
              <Link to="/profile" style={{ textAlign: 'center' }}>Profile</Link>
              <Link to="/bookings" style={{ textAlign: 'center' }}>Bookings</Link>
              <Link to="/fav" style={{ textAlign: 'center' }}>Favorites</Link>
              <Link to="/records" style={{ textAlign: 'center' }}>Medical Records</Link>
              <Link>Help</Link>
              <p
                style={{ color: 'red', marginLeft: '10px', marginTop: '8px', marginBottom: '0px' }}
                onClick={() => {
                  localStorage.removeItem('hospitalToken');
                  setLogin(false);
                  toggleLogin();
                  window.location.reload();
                }}
              >
                Sign Out
              </p>
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" onClick={handleVerify}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
