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
  }, []);

  useEffect(() => {
    if (searchQuery) {
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
          <img src={logo} alt="Logo" className="logo" style={{ height: '60px', width: 'auto' }} />
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
       
      </div>
    
        <div className="dropdown-end">
          <div role="button" className="avatar" onClick={toggleAvatarDropdown}>
            <Avatar name="User" round={true} size="40" />
          </div>
          {isAvatarDropdownOpen && (
            <div className="menu-dropdown">
              <Link to="/account-details" style={{ textAlign: 'center' }}>Account details</Link>
              <Link to="/help-support" style={{ textAlign: 'center' }}>Help and Support</Link>
              <p
                style={{ color: 'red', marginLeft: '10px', marginTop: '8px', marginBottom: '0px' }}
                onClick={() => {
                  localStorage.removeItem('hospitalToken');
                  localStorage.removeItem('hospId');
                  localStorage.removeItem('role');
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
      
    </div>
  );
};

export default Navbar;
