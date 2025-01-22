const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
    
// Serve the static folder for images
app.use('/profile-picture', express.static(path.join(__dirname, 'profile-picture')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/get.profile", async (req, res) => {
    try {
        const client = await MongoClient.connect(process.env.DB_URI, { useUnifiedTopology: true });
        const db = client.db('user-account');
        const query = { userid: 1 };
        const result = await db.collection('users').findOne(query);
        client.close();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user profile');
    }
});

app.post('/update-profile', async (req, res) => {
    const userObj = req.body;
    userObj['userid'] = 1;

    try {
        const client = await MongoClient.connect(process.env.DB_URI, { useUnifiedTopology: true });
        const db = client.db('user-account');
        const query = { userid: 1 };
        const newValues = { $set: userObj };

        await db.collection('users').updateOne(query, newValues, { upsert: true });
        client.close();
        res.send(userObj);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating profile');
    }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8081, () => {
    console.log('App listening on port 3000!');
});
