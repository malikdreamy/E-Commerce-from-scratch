const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const http = require('http');
const fs = require('fs'); // Import the 'fs' module
const helmet = require('helmet');
const routes = require('./controllers/index.js');
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Ecommerce-Example';
const app = express();

const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/Ecommerce-Example', // MongoDB connection URI
  collection: 'sessions', // Name of the collection to store sessions
});

// Set up Handlebars as the view engine
// Middleware
app.use(cors({}));

app.use(helmet.xXssProtection())
app.use(cookieparser())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.APP_SESSION,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000 ,// 3 days in milliseconds
    httpOnly: true,
    secure: false,//make true during production
    sameSite: 'strict',
  },

  resave: false,
  saveUninitialized: true,
  store: store,
}));
app.set('views', path.join(__dirname, 'views')); // use ejs for admin
app.set('view engine', 'ejs');


const server = http.createServer(app);
app.use(routes);

// Routes

app.use(express.static(path.join(__dirname, 'public')));



// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the HTTPS server
    // httpsServer.listen(PORT, () => {
    //   console.log(`Server Listening on Port ${PORT}`);
    // });
    // const httpServer = http.createServer(httpApp);
server.listen(3000, () => {
  console.log('Server Listening On Port 3000');
});


  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

