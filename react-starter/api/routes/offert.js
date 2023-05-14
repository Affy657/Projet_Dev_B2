const express = require('express');
const { ObjectId } = require('mongodb');
const route = express.Router();

function handler(db) {
    const collection = db.collection('listingsAndReviews');
    const bookCollection = db.collection('bookings');
    const userCollection = db.collection('users');

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
        if (!req.query.checkIn) {
            return res.status(400).json({
                error: 'Missing checkIn query',
            })
        }
        if (!req.query.checkOut) {
            return res.status(400).json({
                error: 'Missing checkOut query'
            })
        }

        const opts = {
            skip: parseInt(req.query.skip),
            limit: parseInt(req.query.limit)
        }

        if (req.query.reviews !== 'true') {
            opts.projection = {
                reviews: 0
            }
        }

        const checkIn = new Date(req.query.checkIn).toDateString();
        const checkOut = new Date(req.query.checkOut).toDateString();

        const filter = {
            guests_included: { $gte: 1 }
        };

        if (parseInt(req.query.guests) > 0 && !isNaN(parseInt(req.query.guests))) {
            filter.guests_included = { $gte: parseInt(req.query.guests) }
        }

        if (req.query.query) {
            filter.$text = {
                $search: req.query.query,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
        }

        const offerts = await collection.find(filter, opts).map(async (offert) => {
            const count = await bookCollection.countDocuments({
                check_in: { $lte: checkOut },
                check_out: { $gte: checkIn },
                offert_id: offert._id
            });

            offert.isAvailable = count < 1;

            return offert;
        }).toArray()

        res.status(200).json(offerts);
    });

    route.get('/booking', async (req, res) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({
                error: 'Must you login before used this endpoint'
            })
        }
        const user = await userCollection.findOne({ token });
        if (!user) {
            return res.status(403).json({
                error: 'Must you login before used this endpoint'
            })
        }
        const bookings = await bookCollection.find({ user_id: user._id }).map(async (book) => {
            book.offert = await collection.findOne({ _id: book.offert_id }, {
                projection: {
                    name: 1
                }
            });

            return book;
        }).toArray();

        return res.status(200).json(bookings);
    });

    route.delete('/booking/:id', async (req, res) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({
                error: 'Must you login before used this endpoint'
            })
        }
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid id'
            })
        }
        const user = await userCollection.findOne({ token });
        if (!user) {
            return res.status(403).json({
                error: 'Must you login before used this endpoint'
            })
        }
        const result = await bookCollection.deleteOne({ user_id: user._id, _id: ObjectId.createFromHexString(req.params.id) });

        if (!result.acknowledged || result.deletedCount < 1) {
            return res.status(500).json({
                error: 'Cannot delete'
            })
        }

        return res.status(204).end();
    })

    route.get('/suggestion', async (req, res) => {
        if (!req.query.query) {
            return res.status(400).json({
                error: 'Missing query'
            })
        }

        if (!req.query.limit || isNaN(parseInt(req.query.limit))) {
            return res.status(400).json({
                error: 'Missing or Invalid limit query'
            })
        }

        const opts = {}

        if (req.query.reviews !== 'true') {
            opts.projection = {
                'address.country': 1,
                'address.market': 1
            }
        }

        const results = await collection.find({
            $text: {
                $search: req.query.query,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
        }, opts).toArray();

        let listOfSuggestions = [];

        for (const suggestion of results) {
            const suggestions = [suggestion.address.country];

            if (suggestion.address.market) {
                suggestions.push(suggestion.address.market);
            }

            if (!listOfSuggestions.includes(suggestions.join(', '))) {
                listOfSuggestions.push(suggestions.join(', '));
            }
        }

        res.status(200).json(listOfSuggestions.slice(0, parseInt(req.query.limit)));
    })

    route.get('/:id', async (req, res) => {
        const id = req.params.id;
        
        const result = await collection.findOne({ _id: id });

        if (!result) {
            return res.status(404).json({
                error: 'Offert not found'
            });
        }

        return res.status(200).json(result);
    })

    route.post('/:id/book', async (req, res) => {
        if (!req.body.checkIn) {
            return res.status(400).json({
                error: 'Missing checkIn'
            })
        }
        if (!req.body.checkOut) {
            return res.status(400).json({
                error: 'Missing checkOut'
            })
        }
        if (!req.body.guests) {
            return res.status(400).json({
                error: 'Missing guests'
            })
        }

        const token = req.headers.authorization;

        const user = await userCollection.findOne({ token });

        if (!user) {
            return res.status(403).json({
                error: 'Must you login before used this endpoint'
            })
        }

        if (ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid id'
            })
        }

        const offert = await collection.findOne({
            _id: ObjectId.isValid(req.params.id) ? ObjectId.createFromHexString(req.params.id) : req.params.id
        });

        if (!offert) {
            return res.status(404).json({
                error: 'Offert not found'
            })
        }

        const checkIn = new Date(req.body.checkIn).toDateString();
        const checkOut = new Date(req.body.checkOut).toDateString();

        const count = await bookCollection.countDocuments({
            check_in: { $lte: checkOut },
            check_out: { $gte: checkIn },
            offert_id: offert._id
        });

        if (count > 0) {
            return res.status(400).json({
                error: 'Offert already booked'
            })
        }

        const inserted = await bookCollection.insertOne({
            check_in: checkIn,
            check_out: checkOut,
            user_id: user._id,
            offert_id: offert._id,
            guests: parseInt(req.body.guests)
        });

        if (!inserted.acknowledged) {
            return res.status(500).json({
                error: 'Can not book this offert'
            })
        }

        return res.status(200).json({
            bookId: inserted.insertedId
        })
    });

    return route;
}

module.exports = handler;