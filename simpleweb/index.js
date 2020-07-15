const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Heyyyyyyy girl <3')
});

app.listen(8080, () => {
    console.log('E Listening on port 8080')
})