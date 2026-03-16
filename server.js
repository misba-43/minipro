

const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  .catch(err => console.error("Database connection error:", err));

// Serve index.html from root folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Example form submission route
app.post('/submit', async (req, res) => {
  try {
    const { name, email, comment } = req.body;

    await pool.query(
      "INSERT INTO contact_form(name, email, comment) VALUES($1,$2,$3)",
      [name, email, comment]
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
