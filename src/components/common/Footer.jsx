import React from 'react';
import { Container, Grid, Typography, Link as MuiLink, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#333333', padding: '40px 0', color: '#ffffff', borderTop: '1px solid #444444' }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom style={{ color: '#ffffff' }}>Contact Us:</Typography>
            <Typography>
              <MuiLink href="mailto:support@bookmyappointments.in" underline="none" color="inherit">
                Email: support@bookmyappointments.in
              </MuiLink>
            </Typography>
            <Typography>
              <MuiLink href="tel:+9128328383" underline="none" color="inherit">
                Phone: +91 28328383
              </MuiLink>
            </Typography>
            <Typography>Address: 321 Kukatpally, Hyderabad</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom style={{ color: '#ffffff' }}>Quick Links:</Typography>
            <Box component="ul" sx={{ listStyleType: 'none', padding: 0 }}>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink component={RouterLink} to='/' underline="none" color="inherit">Home</MuiLink>
              </Box>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink component={RouterLink} to='/hospital' underline="none" color="inherit">Hospitals</MuiLink>
              </Box>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink href="/lab" underline="none" color="inherit">Labs</MuiLink>
              </Box>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink component={RouterLink} to='/terms-conditions' underline="none" color="inherit">Terms and Conditions</MuiLink>
              </Box>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink component={RouterLink} to='/privacy-policy' underline="none" color="inherit">Privacy Policy</MuiLink>
              </Box>
              <Box component="li" sx={{ marginBottom: '8px' }}>
                <MuiLink component={RouterLink} to='/help-support' underline="none" color="inherit">Help and support</MuiLink>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom style={{ color: '#ffffff' }}>Follow Us:</Typography>
            <Box>
              <IconButton href="#" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton href="#" color="inherit">
                <Twitter />
              </IconButton>
              <IconButton href="#" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton href="#" color="inherit">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Typography variant="body2" style={{ color: '#bbbbbb' }}>© BookMyAppointments</Typography>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;
