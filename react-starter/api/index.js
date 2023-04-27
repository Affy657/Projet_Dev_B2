require('dotenv').config();
const http = require('http');
const express = require('express');
const {MongoClient} = require('mongodb');

// Routes
const auth = require('./routes/auth.js');

const PORT = process.env.PORT || '3001';

const app = express();

const client = new MongoClient(process.env.MONGO_URI);

const db = client.db('sample_airbnb');

app.use(express.json({
    extended: true
}))

app.use('/auth', auth(db));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK'
    });
});

http.createServer(app)
    .listen(PORT, () => {
        console.log('API start at port %s', PORT);

        client.connect().then(() => {
            console.log('Database connected');
        });
    });