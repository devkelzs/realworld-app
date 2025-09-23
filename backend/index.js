const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const users = [
  { id: 1, name: "Kelly" },
  { id: 2, name: "Alex" },
  { id: 3, name: "Chris" }
];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/', (req, res) => {
  res.send("Welcome to Real-World App API!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
