const express = require('express');
const redis = require('redis');

// make an instance of express
const app = express();


const client = redis.createClient({
    /**  
     * specify where the server is running.
     * if we were not using docker we would put in some type of address/connection url. ex) 'https://my-redis-server.com'
     * 
     * since we are using docker compose, we can refer to the the redis container also running by name.
     * express & redis have no idea what 'rdeis-server' means, redis takes string and has faith its a meaningful URL
     * when connection request goes out from node-app, docker will see it and see it's trying to accesss a host and redirect it to the other container named 'redis-server'
    */
    host: 'redis-server',
    // can specify port, by default port used with reddit is 6379
    port: 6379
});

client.set('visits', 0);

app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        res.send('Number of visits is ' + visits);
        client.set('visits', parseInt(visits) + 1);
    })
})

app.listen(8081, () => {
    console.log('Listening on port 8081');
})