const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Contact route
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  const newEntry = { name, email, phone, message, time: new Date().toISOString() };
  const file = 'messages.json';
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  existing.push(newEntry);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Email failed');
    } else {
      res.status(200).send('Message stored and email sent');
    }
  });
});

// Fallback for GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
