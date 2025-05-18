'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import VehicleBookingForm from '@/component/forms/VehicleBookingForm';

export default function Home() {
  const scrollToForm = () => {
    const el = document.getElementById('booking-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '100vh' },
          backgroundImage: "url('/images/car-bg.jpg')", // ← swap in your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.4)',
          }}
        />
        {/* Hero content */}
        <Box sx={{ position: 'relative', zIndex: 1, px: 2, maxWidth: 600 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Rent a Car for Every Journey
          </Typography>
         <Button
  onClick={scrollToForm}
  size="large"
  sx={{
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      boxShadow: 'none',
    },
  }}
>
  Book Now
</Button>
        </Box>
      </Box>

      {/* Booking Form */}
      <Box
        id="booking-form"
        sx={{
          py: 6,
          // background: 'transparent',
           backgroundImage: "url('/images/car-bg-2.jpg')", // ← swap in your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
              height: { xs: '50vh', md: '100vh' },
        }}
      >
        <VehicleBookingForm />
      </Box>
    </>
  );
}
