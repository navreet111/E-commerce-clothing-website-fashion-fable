const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// New route for handling reviews
app.get('/reviews', (req, res) => {
    fs.readFile('reviews.json', (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).send({ message: 'Error reading reviews file' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send({ message: 'Error parsing reviews file' });
        }
    });
});

app.post('/reviews', (req, res) => {
    const newReview = req.body;
    fs.readFile('reviews.json', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.writeFile('reviews.json', JSON.stringify([newReview], null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to reviews file:', err);
                        return res.status(500).send({ message: 'Error writing to reviews file' });
                    }
                    res.status(201).json(newReview);
                });
            } else {
                console.error('Error reading reviews file:', err);
                return res.status(500).send({ message: 'Error reading reviews file' });
            }
        } else {
            try {
                const jsonData = JSON.parse(data);
                jsonData.push(newReview);
                fs.writeFile('reviews.json', JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to reviews file:', err);
                        return res.status(500).send({ message: 'Error writing to reviews file' });
                    }
                    res.status(200).json(newReview);
                });
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                res.status(500).send({ message: 'Error parsing reviews file' });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
