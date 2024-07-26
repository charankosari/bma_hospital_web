// import React from 'react';
// import { Container, Typography, Box, Link, List, ListItem } from '@mui/material';
// import Footer from '../common/Footer';
// const PrivacyPolicy = () => {
//   const openWebsite = () => {
//     window.open('https://www.bookmyappointments.in', '_blank');
//   };

//   return (
//     <> 
//     <Container maxWidth="md" sx={{ padding: 4, backgroundColor: '#ffffff' }}>
//       <Typography variant="h3" component="h1" gutterBottom align="center">
//         Privacy Policy
//       </Typography>

//       <Typography variant="body1" paragraph>
//         We, Book My Appointment, along with our affiliates, operate the website{' '}
//         <Link href="#" onClick={openWebsite} sx={{ color: '#0066cc' }}>
//           www.bookmyappointments.in
//         </Link>
//         {' '}and the Book My Appointment software, services, and applications, including the mobile app{' '}
//         <strong>'Book My Appointment'</strong> and <strong>'Book My Appointment Diagnostics'</strong>. Our priority is to protect the information you provide as a user. This Privacy Policy explains how we collect, share, and safeguard your data. It reflects our commitment to protecting your privacy and personal information. This policy applies to the collection, storage, processing, disclosure, and transfer of your Personal Information as per the relevant laws when using our Services. We aim to comply with legal requirements including the Information Technology Act of 2000 concerning data collection, processing, and transfer. Please read this Privacy Notice closely before using any of our products or services.
//       </Typography>

//       <Typography variant="h6" component="h2" gutterBottom>
//         1. What Information Do We Collect?
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>1.1. Personal Information:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Email address, phone number, gender, date of birth, and pin code.</ListItem>
//           <ListItem>• Data concerning your usage of the services and appointment history.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>1.2. Sensitive Information:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Passwords; financial details such as bank account, credit card, debit card, or other payment instrument information.</ListItem>
//           <ListItem>• Physical, physiological, and mental health conditions; medical records and history; biometric information.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>1.3. Cookies:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Cookies are small data files stored on your web browser, used for technical administration, research and development, storage, previous browsing activities, and user administration.</ListItem>
//           <ListItem>• By visiting Book My Appointment, you consent to the placement of cookies. Cookies do not store personal information.</ListItem>
//           <ListItem>• We recommend periodically clearing cookies from your browser for optimal use.</ListItem>
//         </List>
//       </Box>

//       <Typography variant="h6" component="h2" gutterBottom>
//         2. Use of Data
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>2.1. We use your data for:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Technical administration and customization of the website.</ListItem>
//           <ListItem>• Investigating, enforcing, and resolving disputes.</ListItem>
//           <ListItem>• Addressing requests, queries, and complaints related to our services.</ListItem>
//           <ListItem>• Providing personalized services and targeted advertisements.</ListItem>
//           <ListItem>• Sending notices, communications, alerts, and new offers.</ListItem>
//           <ListItem>• Improving our business, products, and services.</ListItem>
//           <ListItem>• Fulfilling obligations with business partners or contractors.</ListItem>
//           <ListItem>• Contacting you to provide information on new services and offers.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>2.2. Data Retention:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Data is retained for up to 7 days for reinstatement of your account. Data is kept as needed to provide services or as required by law.</ListItem>
//           <ListItem>• Data may be retained in anonymized form for analytical and research purposes.</ListItem>
//         </List>
//       </Box>

//       <Typography variant="h6" component="h2" gutterBottom>
//         3. Source of Data Collection
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>3.1. We collect information from:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Direct interactions with our app, website, email, or other communication methods.</ListItem>
//           <ListItem>• Healthcare providers with your permission.</ListItem>
//           <ListItem>• Cookies and email interactions. You can opt-out of marketing emails using the unsubscribe link.</ListItem>
//           <ListItem>• Third-party websites and services using our technology. These are subject to their privacy policies.</ListItem>
//         </List>
//       </Box>

//       <Typography variant="h6" component="h2" gutterBottom>
//         4. Data Sharing
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>4.1. Partners:</strong>
//         </Typography>
//         <List>
//           <ListItem>• We may disclose information to business partners and affiliates involved in providing products and services.</ListItem>
//           <ListItem>• In the event of business expansion, information may be shared with new entities.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>4.2. Service Providers:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Information may be shared with service providers for data storage, software services, and marketing.</ListItem>
//           <ListItem>• We address suspected data breaches and reserve the right to disclose data as required by law or to protect against harm.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>4.3. Third Parties:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Information may be shared to maintain the security of our website or app.</ListItem>
//           <ListItem>• Data may be shared with employees, consultants, business partners, and technology partners on a need-to-know basis.</ListItem>
//           <ListItem>• Data may be shared with your healthcare providers.</ListItem>
//         </List>
//       </Box>

//       <Typography variant="h6" component="h2" gutterBottom>
//         5. Data Security
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>5.1. Security Measures:</strong>
//         </Typography>
//         <List>
//           <ListItem>• We adhere to industry-standard security practices to protect your data.</ListItem>
//           <ListItem>• We cannot be held liable for data loss or theft due to unauthorized access to your devices.</ListItem>
//           <ListItem>• Ensure the security of your electronic devices when using our services.</ListItem>
//         </List>

//         <Typography variant="body1" gutterBottom>
//           <strong>5.2. Contact:</strong>
//         </Typography>
//         <List>
//           <ListItem>• For concerns regarding data misuse or unauthorized access, contact us at bookmyappointment@gmail.com.</ListItem>
//         </List>
//       </Box>

//       <Typography variant="h6" component="h2" gutterBottom>
//         6. Third-Party Websites and Services
//       </Typography>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="body1" gutterBottom>
//           <strong>6.1. Links to Third-Party Sites:</strong>
//         </Typography>
//         <List>
//           <ListItem>• Our website and app may link to third-party websites and services. Use these at your own risk.</ListItem>
//           <ListItem>• We are not responsible for any issues arising from the use of these third-party sites. Read their privacy policies before use.</ListItem>
//         </List>
//       </Box>
//     </Container>
//     <Footer/></>
//   );
// };

// export default PrivacyPolicy;

import React from 'react'

function PrivacyPolicy() {
  return (
    <div>PrivacyPolicy
      
    </div>
  )
}

export default PrivacyPolicy
