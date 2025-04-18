// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT = 3009;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Path to the user.json file
// const dataFile = path.join(__dirname, 'user.json');

// // Ensure user.json exists
// if (!fs.existsSync(dataFile)) {
//     fs.writeFileSync(dataFile, JSON.stringify([]));
// }

// // Route to get all users (optional)
// app.get('/cart', (req, res) => {
//     const data = fs.readFileSync(dataFile);
//     res.json(JSON.parse(data));
// });

// // Route to post a new cart item
// app.post('/cart', (req, res) => {
//     const newItem = req.body;

//     // Read existing data
//     let data;
//     try {
//         data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
//     } catch (error) {
//         console.error("Error reading data:", error);
//         return res.status(500).json({ success: false, message: 'Failed to read cart data.' });
//     }

//     // Push new item
//     data.push(newItem);

//     // Save back to file
//     try {
//         fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
//     } catch (error) {
//         console.error("Error writing data:", error);
//         return res.status(500).json({ success: false, message: 'Failed to save cart data.' });
//     }

//     res.json({ success: true, message: 'Item added to cart!' }); // Send success message
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// cart backend  (e.g., http://localhost:3009)
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jwt
const app = express();
const PORT = 3009;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Path to the user.json file
const dataFile = path.join(__dirname, 'user.json');

// Ensure user.json exists
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, 'your_secure_secret_key', (err, decoded) => {  // Replace 'your_secure_secret_key'
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.user = decoded; // Attach decoded user info to req.user
        next();
    });
};

// Route to get all cart items
app.get('/cart', (req, res) => {
    fs.readFile(dataFile, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data:", err);
            return res.status(500).json({ success: false, message: 'Failed to read cart data.' });
        }
        res.json(JSON.parse(data));
    });
});

// Route to post a new cart item
app.post('/cart', verifyToken, (req, res) => { // Apply verifyToken middleware
    if (req.user && req.user.role === 'seller') {
        return res.status(403).json({ message: 'Sellers are not allowed to add items to the cart.' });
    }

    const newItem = req.body;

    fs.readFile(dataFile, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading data:", err);
            return res.status(500).json({ success: false, message: 'Failed to read cart data.' });
        }

        let cartData = JSON.parse(data);
        cartData.push(newItem);

        fs.writeFile(dataFile, JSON.stringify(cartData, null, 2), (err) => {
            if (err) {
                console.error("Error writing data:", err);
                return res.status(500).json({ success: false, message: 'Failed to save cart data.' });
            }

            res.json({ success: true, message: 'Item added to cart!' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
