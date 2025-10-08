const { createClient }  = require('redis');
const dotenv = require("dotenv")
dotenv.config()

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16968.c258.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16968
    }
});

module.exports = redisClient;