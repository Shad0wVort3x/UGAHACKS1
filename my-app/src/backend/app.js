const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const financialRoutes = require('./routes/financials');
const eventRoutes = require('./routes/events');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/fetchUsers'); // Corrected path

// Enable CORS for requests from port 3000 (frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
    credentials: true, // Include credentials if needed
}));
app.use(express.json());

// Use environment variable for MongoDB URI
const uri = process.env.MONGO_URI || "mongodb+srv://dbUser:123@gameify.w1lmu.mongodb.net/?retryWrites=true&w=majority&appName=Gameify";

// Connect to MongoDB with Mongoose
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB via Mongoose'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use routes
app.use('/api/financials', financialRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter); // Corrected path

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});