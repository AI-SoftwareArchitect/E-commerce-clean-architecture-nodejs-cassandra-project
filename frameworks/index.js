const express = require('express');
const userRouter = require('../routes/user.route');
const app = express();
const port = 3000;

const verifyRoutes = require('../routes/verify.route'); // Doğru yolu kontrol edin

app.use(express.json());
app.use('/user', userRouter);
app.use('/verify', verifyRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

