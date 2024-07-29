import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MyBookings = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const jwtToken = localStorage.getItem('hospitalToken');
        const response = await axios.post('https://server.bookmyappointments.in/api/bma/hospital/test/bookingdetails', {
          testid: id,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.status === 200) {
          categorizeBookings(response.data.bookings);
        } else {
          console.error('Error fetching booking details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    const categorizeBookings = (bookings) => {
      const today = new Date().toISOString().slice(0, 10);
      const todayBookings = [];
      const upcomingBookings = [];
      const completedBookings = [];

      bookings.forEach((item) => {
        const bookingDate = new Date(item.booking.date).toISOString().slice(0, 10);
        if (bookingDate === today) {
          todayBookings.push(item);
        } else if (new Date(bookingDate) > new Date(today)) {
          upcomingBookings.push(item);
        } else {
          completedBookings.push(item);
        }
      });

      setTodayBookings(todayBookings);
      setUpcomingBookings(upcomingBookings);
      setCompletedBookings(completedBookings);
    };

    fetchBookingDetails();
  }, [id]);

  const renderBookingCard = (item) => (
    <div key={item.booking._id} style={styles.card}>
      <div style={styles.cardHeader}>
        <h4>Booking ID: {item.booking.id}</h4>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>person</span>
          <span style={styles.label}>Name:</span>
          <span style={styles.value}>{item.booking.name}</span>
        </div>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>phone</span>
          <span style={styles.label}>Contact:</span>
          <span style={styles.value}>{item.booking.phonenumber}</span>
        </div>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>email</span>
          <span style={styles.label}>Email:</span>
          <span style={styles.value}>{item.booking.email}</span>
        </div>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>event</span>
          <span style={styles.label}>Date:</span>
          <span style={styles.value}>{new Date(item.booking.date).toLocaleDateString()}</span>
        </div>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>access_time</span>
          <span style={styles.label}>Time:</span>
          <span style={styles.value}>{item.booking.time}</span>
        </div>
        <div style={styles.infoRow}>
          <span className="material-icons" style={{ color: '#2BB673' }}>attach_money</span>
          <span style={styles.label}>Amount Paid:</span>
          <span style={styles.value}>{item.booking.amountpaid}</span>
        </div>
        <p style={styles.bookedOn}>Booked on: {item.booking.bookedOn.split("T")[0]}</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
        </div>
      ) : (
        <div style={styles.scrollViewContent}>
          {todayBookings.length > 0 && (
            <>
              <h3 style={styles.header}>Today's Bookings</h3>
              {todayBookings.map((item) => renderBookingCard(item))}
            </>
          )}

          {upcomingBookings.length > 0 && (
            <>
              <h3 style={styles.header}>Upcoming Bookings</h3>
              {upcomingBookings.map((item) => renderBookingCard(item))}
            </>
          )}

          {completedBookings.length > 0 && (
            <>
              <h3 style={styles.header}>Completed Bookings</h3>
              {completedBookings.map((item) => renderBookingCard(item))}
            </>
          )}

          {todayBookings.length === 0 && upcomingBookings.length === 0 && completedBookings.length === 0 && (
            <p style={styles.noBookingsText}>No bookings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
  },
  spinnerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 99,
  },
  spinner: {
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #2BB673',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1.5s linear infinite',
  },
  scrollViewContent: {
    padding: '20px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  },
  cardHeader: {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  cardContent: {
    paddingVertical: '10px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginLeft: '5px',
  },
  value: {
    fontSize: '14px',
    color: '#555',
    marginLeft: '10px',
  },
  bookedOn: {
    fontSize: '12px',
    color: '#777',
    marginTop: '10px',
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '20px',
    color: '#555',
  },
};

export default MyBookings;
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }`;

styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
