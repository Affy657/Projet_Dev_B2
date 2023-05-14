const express = require('express');
const crypto = require('node:crypto');
const route = express.Router();

function handler(db) {
    const collection = db.collection('users');

    route.post('/login', async (req, res) => {
        console.log(req.body.username);
        if (!req.body.username) {
            return res.status(400).json({
                error: 'Missing username'
            })
        }
        if (!req.body.password) {
            return res.status(400).json({
                error: 'Missing password'
            })
        }

        const hash = crypto
            .createHash('sha256');
            
        hash.update(req.body.password);
            
        const password = hash.digest('base64');

        const user = await collection.findOne({
            username: req.body.username,
            password: password
        }, {
            projection: {
                password: 0
            }
        });

        if (!user) {
            return res.status(400).json({
                error: 'Bad password or username'
            })
        }

        res.status(200).json({ user });
    });

    route.post('/register', async (req, res) => {
        if (!req.body.username) {
            return res.status(400).json({
                error: 'Missing username'
            })
        }
        if (!req.body.password) {
            return res.status(400).json({
                error: 'Missing password'
            })
        }

        const ifUsersExist = await collection.findOne({ username: req.body.username });

        if (ifUsersExist) {
            return res.status(400).json({
                error: 'Users already exist'
            })
        }

        const hash = crypto.createHash('sha256');

        hash.update(req.body.password);

        const password = hash.digest('base64');
        const hashToken = crypto.createHash('sha256');

        hashToken.update('' + (process.pid + Date.now() + Math.random()));

        const token = hashToken.digest('hex');

        const result = await collection.insertOne({
            username: req.body.username,
            password,
            token
        });

        if (!result.acknowledged) {
            return res.status(500).json({
                error: 'Internal Error'
            });
        }

        res.status(202).json({
            id: result.insertedId
        })
    });

    return route;
}

module.exports = handler;