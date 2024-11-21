const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

require('dotenv').config();
const app = express();

///1h90T96MbNGPS8mL booking
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(express.json());
app.use(cookieParser());
//// errror solution 
app.use(cors({
  origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
}));
// past code of the error 
/*app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));*/


mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req,res) =>{
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const {name, email,password} = req.body;
  try{
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc);
  } catch(e){
    res.status(422).json(e);
  }
  
});

app.post('/login', async (req,res) => {
  //mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.listen(4000);