const express = require('express');
const cors = require('cors');
const userRouter = require('../routes/user.route');
const verifyRoutes = require('../routes/verify.route'); // Correct path

const app = express();
const port = 3000;

// CORS Middleware should be defined before any routes
app.use(cors({
  origin: 'http://localhost:5174',  // Explicitly allow only your frontend origin
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,  // Allow cookies or authorization headers with requests
}));

app.use(express.json());

// Routes
app.use('/user', userRouter);
app.use('/verify', verifyRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
