const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

require('dotenv').config()


///1h90T96MbNGPS8mL booking

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));


mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req,res) =>{
  res.json('test ok');
});

app.post('/register', (req, res) => {
  const {name, email,password} = req.body;
  User.create({
    name,
    email,
    password,
  })
  res.json({name, email,password});
});

app.listen(4000);