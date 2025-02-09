const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const financialRoutes = require('./routes/financials');
const eventRoutes = require('./routes/events');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/fetchUsers'); // Corrected path

// Hardcoded MongoDB URI and JWT secret
const MONGO_URI = "mongodb+srv://dbUser:123@gameify.w1lmu.mongodb.net/?retryWrites=true&w=majority&appName=Gameify";
const JWT_SECRET = 'f6be9459e3800df224d0dad13754b85c4f541efef4f5c2f0504bee6da0362d59880766899df3c2538c87d7b48ee69b06d65646080bf03f8e2efca0653c939a1f';

// Enable CORS for requests from port 3000 (frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
    credentials: true, // Include credentials if needed
}));
app.use(express.json());

// Connect to MongoDB with Mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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