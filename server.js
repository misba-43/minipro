
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------
// 1️⃣ PostgreSQL connection
// ------------------------
const pool = new Pool({
  connectionString:
"postgresql://postgres:RxLTABiQZUKZvhFTQXSvzgBjNGrVfGou@hopper.proxy.rlwy.net:35359/railway",
ssl:{
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL database!"))
  .catch(err => console.error("Connection error:", err));

// ------------------------
// 2️⃣ Create table if it doesn't exist
// ------------------------
pool.query(`
  CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    comment TEXT
  );
`, (err) => {
  if(err) console.error("Table creation error:", err);
  else console.log("Table ready!");
});

// ------------------------
// 3️⃣ Middleware
// ------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------
// 4️⃣ Routes
// ------------------------

// Serve the portfolio page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle contact form submission
app.post('/add-user', (req, res) => {

  const { name, email, comment } = req.body;

  const query = "INSERT INTO contact_form (name, email, comment) VALUES ($1, $2, $3)";

  pool.query(query, [name, email, comment], (err) => {

    if(err) {
      console.error("Error storing data:", err);
      return res.send("<h1>Error storing data. Try again.</h1><a href='/'>Back</a>");
    }

    res.send(`<h1>Thank you, ${name}! Your message has been stored.</h1><a href='/'>Back to Home</a>`);

  });

});

// ------------------------
// 5️⃣ Start server
// ------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});