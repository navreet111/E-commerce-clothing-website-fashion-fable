// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3008;
// const SECRET_KEY = "your_secure_secret_key";

// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));  // Serve static files

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: "Access denied: No token provided" });
//     }

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: "Invalid token." });
//         }

//         req.user = user;
//         next();
//     });
// };

// // User registration endpoint
// app.post('/register', async (req, res) => {
//     const { name, email, password, role } = req.body;

//     // Basic validation
//     if (!name || !email || !password || !role) {
//         return res.status(400).json({ message: "All fields are required, including role" });
//     }

//     // Validate the role
//     if (role !== 'seller') {
//         return res.status(400).json({ message: "Invalid role. Role must be either 'customer' or 'seller'." });
//     }


//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Store user data (replace with database)
//     const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
//     const newUser = { id: users.length + 1, name, email, password: hashedPassword, role: role };
//     users.push(newUser);
//     fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

//     res.status(201).json({ message: "User registered successfully" });
// });


// // User login endpoint
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Retrieve user from database (or file)
//     const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
//     const user = users.find(u => u.email === email);

//     if (!user) {
//         return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Compare passwords
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//         return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Create and assign a token
//     const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET_KEY, {
//         expiresIn: '1h'
//     });

//     res.json({ token, role: user.role, message: "Login successful!" });
// });

// // Protected cart endpoint
// app.post('/cart', verifyToken, (req, res) => {
//     const userRole = req.user.role; // Get role from verified token

//     if (userRole === 'seller') {
//         return res.status(403).json({ message: "Sellers are not allowed to add items to the cart." });
//     }

//     // Existing code to add item to cart
//     const cartItem = req.body;
//     const userId = req.user.userId;

//     const carts = JSON.parse(fs.readFileSync('user.json', 'utf-8'));
//     carts.push({ userId, ...cartItem });
//     fs.writeFileSync('user.json', JSON.stringify(carts, null, 2));

//     res.status(201).json({ message: "Item added to cart" });
// });


// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
// index.js (http://localhost:3008)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3008;
const SECRET_KEY = "your_secure_secret_key";  // Keep this secret and secure!

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied: No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token." });
        }

        req.user = decoded;
        next();
    });
};

// User registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required, including role" });
    }

    if (role !== 'customer' && role !== 'seller') {
        return res.status(400).json({ message: "Invalid role. Role must be either 'customer' or 'seller'." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usersFile = path.join(__dirname, 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const newUser = { id: users.length + 1, name, email, password: hashedPassword, role: role };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.status(201).json({ message: "User registered successfully" });
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const usersFile = path.join(__dirname, 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    //  Include the role in the token's payload
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET_KEY, {
        expiresIn: '1h'
    });

    res.json({ token, role: user.role, message: "Login successful!" });  // Include role in the response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
