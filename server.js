
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: "postgresql://postgres:RxLTABiQZUKZvhFTQXSvzgBjNGrVfGou@hopper.proxy.rlwy.net:35359/railway",
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example form route
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await pool.query(
      "INSERT INTO contact_form(name, email, message) VALUES($1,$2,$3)",
      [name, email, message]
    );

    res.send("Form submitted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
