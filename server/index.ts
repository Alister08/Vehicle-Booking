
import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './src/lib/prisma'; // Ensure this exports PrismaClient
import bookingRouter from './src/routes/booking/booking'; // Ensure this exports the booking router
import vehicleTypeRouter from './src/routes/vehicletype/vehicletype'; // Ensure this exports the vehicle type router
import vehicleRouter from './src/routes/vehicle/vehicle'; // Ensure this exports the vehicle router


const port = process.env.PORT || 9000;
const app = express();


// Enable CORS for frontend
app.use(cors({
    origin: process.env.MAIN_PUBLIC_DOMAIN, // Allow frontend domain
    methods: 'GET,POST,PUT,DELETE,PATCH',
    // allowedHeaders: 'Content-Type,Authorization',
    credentials: false, // Allow cookies and authentication headers
}));

// Middleware to parse JSON requests
app.use(express.json({ limit: '10mb' }));
app.use('/api/booking', bookingRouter); // Use the booking router for booking-related routes
app.use('/api/vehicletype',vehicleTypeRouter); // Use the vehicle type router
app.use('/api/vehicle', vehicleRouter); // Use the vehicle router for vehicle-related routes



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port 9000`);
});
