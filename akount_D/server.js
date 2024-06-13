const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS 모듈 추가

const app = express();
const PORT = 3000;

app.use(cors()); // CORS 미들웨어 추가
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db.json');

// Read transactions
app.get('/api/transactions', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const { date } = req.query;
  const transactions = db.content.filter((transaction) =>
    transaction.datetime.startsWith(date)
  );
  res.json(transactions);
});

// Save transaction
app.post('/api/transactions', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const { date, amount, memo } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  const newTransaction = { id, datetime: date, amount, memo };
  db.content.push(newTransaction);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json(newTransaction);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
