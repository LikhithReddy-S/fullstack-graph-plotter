const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const path = require('path'); // For serving frontend build

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all routes
app.use(cors());

// API Routes
app.use('/api', require('./routes/api'));

// Serve frontend (if deployed together)
// In a development setup, you'll run frontend and backend separately.
// For production, you might build the React app and serve it from Express.
// Let's add this for completeness, but it's commented out for dev simplicity.
/*
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'dist', 'index.html')
        )
    );
} else {
    app.get('/', (req, res) => res.send('Please set to production for frontend serving'));
}
*/

// Basic error handling middleware (optional but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Something broke!' });
});


app.listen(port, () => console.log(`Server started on port ${port}`));