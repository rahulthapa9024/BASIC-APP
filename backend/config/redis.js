const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: "D92t1m3vGqMYdP9WA0yFwf02FLQR1StH",
    socket: {
        host: 'redis-16968.c258.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16968
    }
});

module.exports = redisClient;