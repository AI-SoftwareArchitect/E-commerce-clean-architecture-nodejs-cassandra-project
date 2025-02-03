const express = require('express');
const userRouter = require('../routes/user.route');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

