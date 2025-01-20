const express = require('express');
const path = require('path');

const app = express();

// Serve the static folder for images
app.use('/profile-picture', express.static(path.join(__dirname, 'profile-picture')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
