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

app.get('/data.json', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send({ message: 'Error reading data file' });
        }
        try {
            const jsonData = JSON.parse(data);
            console.log('Data retrieved:', jsonData);
            res.status(200).json(jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send({ message: 'Error parsing data file' });
        }
    });
});

app.post('/data.json', (req, res) => {
    const newData = req.body;
    console.log('Received data:', newData);

    fs.readFile('data.json', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
               
                console.log('File does not exist. Creating new file...');
                fs.writeFile('data.json', JSON.stringify([newData], null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to data file:', err);
                        return res.status(500).send({ message: 'Error writing to data file' });
                    }
                    console.log('New file created with data:', newData);
                    res.status(201).json(newData);
                });
            } else {
                console.error('Error reading data file:', err);
                return res.status(500).send({ message: 'Error reading data file' });
            }
        } else {
            try {
                const jsonData = JSON.parse(data);
                jsonData.push(newData);

                fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to data file:', err);
                        return res.status(500).send({ message: 'Error writing to data file' });
                    }
                    console.log('Data added successfully:', newData);
                    res.status(200).json(newData); 
                });
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                res.status(500).send({ message: 'Error parsing data file' });
            }
        }
    });
});

app.put('/data.json', (req, res) => {
    const updatedData = req.body;
    console.log('PUT request received:', updatedData);

    fs.readFile('data.json', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send({ message: 'Error reading data file' });
        }

        try {
            const jsonData = JSON.parse(data);
            const index = jsonData.findIndex(item => item.email === updatedData.email);

            if (index !== -1) {
                jsonData[index] = updatedData;
                fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to data file:', err);
                        return res.status(500).send({ message: 'Error writing to data file' });
                    }
                    console.log('Data updated successfully:', updatedData);
                    res.status(200).json(updatedData);
                });
            } else {
                console.log('Data not found for email:', updatedData.email);
                res.status(404).send({ message: 'Data not found' });
            }
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send({ message: 'Error parsing data file' });
        }
    });
});



app.delete('/data.json', (req, res) => {
    console.log('Incoming DELETE request body:', req.body);

    if (!req.body || !req.body.email) {
        console.error('Missing email in request body');
        return res.status(400).send('Email is required in the request body');
    }

    const emailToDelete = req.body.email;

    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).send('Error reading data file');
        }

        try {
            const jsonData = JSON.parse(data);
            console.log('Current JSON data:', jsonData);

            const index = jsonData.findIndex(item => item.email === emailToDelete);

            if (index === -1) {
                console.log(`Email not found: ${emailToDelete}`);
                return res.status(404).send('Data not found');
            }

            jsonData.splice(index, 1);
            console.log(`Data after deletion:`, jsonData);

            fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to data.json:', writeErr);
                    return res.status(500).send('Error writing to data file');
                }
                console.log(`Successfully deleted email: ${emailToDelete}`);
                res.status(200).send('Data deleted successfully');
            });
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            res.status(500).send('Error parsing data file');
        }
    });
});


app.use((req, res) => {
    res.status(404).send('<h1>Error 404: Resource not found</h1>');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
