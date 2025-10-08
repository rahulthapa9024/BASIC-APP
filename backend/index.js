const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require("./routes/userRouter")
const redisClient = require("./config/redis")
const main = require("./config/db")
require('dotenv').config(); // ✅ Load environment variables
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // ✅ Allow frontend on Vite
    credentials: true                // ✅ Allow sending cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use("/user",userRouter)

const InitalizeConnection = async () => {
    try {
        await main();

        // ✅ Prevent redisClient.connect() from being called multiple times
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        console.log('MongoDB and Redis Connected ✅');

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
        });
    } catch (err) {
        console.error('Startup Error ❌:', err);
    }
};

InitalizeConnection();