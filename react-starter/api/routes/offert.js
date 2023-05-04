const express = require('express');
const crypto = require('node:crypto');

const route = express.Router();

function handler(db) {
    const collection = db.collection('listingsAndReviews');

    route.get('/', async (req, res) => {
        if (!req.query.skip) {
            return res.status(400).json({
                error: 'Missing skip query'
            })
        }
        if (!req.query.limit) {
            return res.status(400).json({
                error: 'Missing limit query'
            })
        }

        const opts = {
            skip: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)
        }

        const offerts = await collection.find({}, opts).toArray();

        if (offerts.length < 1) {
            return res.status(404).json({ error: 'not found' });
        }

        res.status(200).json(offerts);
    });

    return route;
}


module.exports = handler;