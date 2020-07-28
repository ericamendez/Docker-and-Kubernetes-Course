const keys = require('./keys')


// EXPRESS APP SETUP
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
// cors allow us to make request from one domain (react app will be running on) to a completely different domain where the express API is hosted on
app.use(cors())
app.use(bodyParser.json())


// POSTGRES CLIENT SETUP
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('Lost PG connection'))

// we have to initially create at least one time a table that will  store all the values
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch (err => console.log(err))


//  REDIS CLIENT SETUP
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})
const redisPublisher = redisClient.duplicate();


// EXPRESS ROUTE HANDLERS
app.get('/', (req, res) => {
    res.send('Hi')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values')

    res.send(values.rows);
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err,values) => {
        res.send(values)
    })
})


// route handler to receive new values from React Appliucation
app.post('/values', async (req,res) => {
    const index = req.body.index

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high!')
    }

    // put value into redis data store, eventually worker will go into hash and replace string with value
    redisClient.hset('values', index, 'Nothing yet!')
    // message that gets send over to the worker process and to pull new number out of redis and calculate new number for it
    redisPublisher.publish('insert', index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    res.send({ working: true })
})

app.listen(5000, err => {
    console.log('Listening')
})