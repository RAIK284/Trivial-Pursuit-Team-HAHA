require('./models/User');
require('./models/GameSession');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello, Trivia Game!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/triviaGame', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Successfully connected to MongoDB');
});
