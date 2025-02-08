const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const financialRoutes = require('./routes/financials');
const eventRoutes = require('./routes/events');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
// Enable CORS for requests from port 3000 (frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
    credentials: true, // Include credentials if needed
  }));
  
  app.use(express.json());

const uri = "mongodb+srv://dbUser:<dbUserPass>@gameify.w1lmu.mongodb.net/?retryWrites=true&w=majority&appName=Gameify"

  // Connect to MongoDB with Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB via Mongoose'))
.catch((error) => console.error('Error connecting to MongoDB:', error));


app.use('/api', financialRoutes);
app.use('/api', eventRoutes);
app.use('/api', registerRouter); 
app.use('/api', loginRouter);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});