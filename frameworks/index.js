const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRouter = require('../routes/user.route');
const verifyRoutes = require('../routes/verify.route'); 
const productRouter = require('../routes/product.route'); 
const sellerRouter = require('../routes/seller.route');

const session = require('express-session');

const sessionSecret = "gSmZlRw7Vt2AWrWlj2TVStlulQhLqor4";

const app = express();
const port = 3000;

app.use(express.static('content/product_images'));

app.use(session({
  secret: 'süperGizliAnahtar', // Değiştirmeyi unutma!
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Prod ortamında true yapmayı unutma (HTTPS şart)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
  }
}));



// CORS Middleware should be defined before any routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // Allow both frontend origins
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,  // Allow cookies or authorization headers with requests
}));

app.use(express.json());

// Routes
app.use('/user', userRouter);
app.use('/verify', verifyRoutes);
app.use('/product', productRouter);
app.use('/sellers', sellerRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
