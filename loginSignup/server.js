// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3004;
// const SECRET_KEY = "fashion-secret-key"; // Use env variable in real projects

// // File paths
// const usersFilePath = path.join(__dirname, 'users.json');
// const feedbacksFilePath = path.join(__dirname, 'feedbacks.json');
// const reviewsFilePath = path.join(__dirname, 'reviews.json');

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public'));

// // Helper functions
// const readJSON = (filePath) => {
//     if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
//     const data = fs.readFileSync(filePath, 'utf-8');
//     return JSON.parse(data || '[]');
// };

// const writeJSON = (filePath, data) => {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
// };

// // JWT Middleware
// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Token missing" });

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(403).json({ message: "Invalid token" });
//     }
// };

// // Admin Middleware
// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: "Admin access only" });
//     }
//     next();
// };

// // Data init
// let users = readJSON(usersFilePath);
// let feedbacks = readJSON(feedbacksFilePath);
// let reviews = readJSON(reviewsFilePath);

// // Default admin creation
// const defaultAdmin = {
//     name: "Admin",
//     email: "admin@fashionhub.com",
//     phone: "0000000000",
//     password: bcrypt.hashSync("admin123", 10),
//     role: "admin",
//     createdAt: new Date().toISOString()
// };

// if (!users.find(u => u.email === defaultAdmin.email)) {
//     users.push(defaultAdmin);
//     writeJSON(usersFilePath, users);
// }

// // ROUTES
// app.get("/", (req, res) => {
//     res.send("Fashion Website Backend Running");
// });

// // Register
// app.post('/register', async (req, res) => {
//     const { name, email, phone, password, role } = req.body;

//     if (!["buyer", "seller"].includes(role)) {
//         return res.status(400).json({ message: "Role must be buyer or seller" });
//     }

//     if (users.find(u => u.email === email)) {
//         return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         role,
//         createdAt: new Date().toISOString()
//     };

//     users.push(newUser);
//     writeJSON(usersFilePath, users);

//     res.status(201).json({ message: "User registered successfully" });
// });

// // Login
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find(u => u.email === email);

//     if (!user) return res.status(401).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign({
//         email: user.email,
//         role: user.role,
//         name: user.name
//     }, SECRET_KEY, { expiresIn: "2h" });

//     res.status(200).json({
//         message: "Login successful",
//         token,
//         user: {
//             name: user.name,
//             email: user.email,
//             role: user.role
//         }
//     });
// });

// // Submit feedback (Authenticated users)
// app.post('/feedback', verifyToken, (req, res) => {
//     const { message } = req.body;

//     if (!message) return res.status(400).json({ message: "Message is required" });

//     const feedback = {
//         id: Date.now(),
//         user: {
//             name: req.user.name,
//             email: req.user.email,
//             role: req.user.role
//         },
//         message,
//         date: new Date().toISOString()
//     };

//     feedbacks.push(feedback);
//     writeJSON(feedbacksFilePath, feedbacks);

//     res.status(201).json({ message: "Feedback submitted successfully" });
// });

// // View all feedbacks (Admin only)
// app.get('/feedbacks', verifyToken, isAdmin, (req, res) => {
//     res.status(200).json(feedbacks);
// });

// // Add review (Authenticated user)
// app.post('/reviews', verifyToken, (req, res) => {
//     const { productId, content } = req.body;

//     if (!productId || !content) {
//         return res.status(400).json({ message: "Product ID and review content are required." });
//     }

//     const review = {
//         id: Date.now(),
//         productId,
//         user: {
//             name: req.user.name,
//             email: req.user.email,
//             role: req.user.role
//         },
//         content,
//         date: new Date().toISOString()
//     };

//     reviews.push(review);
//     writeJSON(reviewsFilePath, reviews);

//     res.status(201).json({ message: "Review added." });
// });

// // View all reviews (Admin only)
// app.get('/reviews', verifyToken, isAdmin, (req, res) => {
//     res.status(200).json(reviews);
// });

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3004;
const SECRET_KEY = "your_secret_key"; // Replace this with a strong secret key

const usersFilePath = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Utility Functions
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, '[]', 'utf-8'); 
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data || '[]');
};

const writeUsers = (data) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing to file:", error);
    }
};

// Middleware for verifying JWT and extracting user role
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token missing." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not provided." });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        req.user = decoded;
        next();
    });
};

// Role-based middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

// Routes
app.get("/", (req, res) => {
    res.status(200).send("Home Page...");
});

app.get("/about", (req, res) => {
    res.send("About Page....");
});

let users = readUsers();

// REGISTER
app.post('/register', async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    if (!role || (role !== "buyer" && role !== "seller")) {
        return res.status(400).json({ message: "Invalid role. Must be 'buyer' or 'seller'." });
    }

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "Email already registered." });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { name, email, phone, password: hashedPassword, role };
        users.push(newUser);
        writeUsers(users);

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) return res.status(401).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password." });

    const token = jwt.sign(
        { email: user.email, role: user.role, name: user.name },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.status(200).json({
        message: "Login successful!",
        token,
        role: user.role,
        name: user.name
    });
});

// PROTECTED EXAMPLE: CUSTOMER-ONLY
app.get("/orders", verifyToken, authorizeRoles("buyer"), (req, res) => {
    res.json({ message: `Welcome ${req.user.name}, here are your orders.` });
});

// PROTECTED EXAMPLE: SELLER-ONLY
app.get("/admin/products", verifyToken, authorizeRoles("seller"), (req, res) => {
    res.json({ message: `Welcome ${req.user.name}, you can manage your products here.` });
});

// PROTECTED EXAMPLE: BOTH ROLES
app.get("/profile", verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.user.name}, role: ${req.user.role}` });
});

// CONTACT US ROUTE (Open to All)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }
    // You can later log or store messages
    res.status(200).json({ message: "Message received. We'll get back to you soon!" });
});

// START SERVER
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});