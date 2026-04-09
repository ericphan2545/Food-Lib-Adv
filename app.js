const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const startServer = async () => {
  try {
    await connectDB(); // CHỜ DB CONNECT
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('DB connection failed:', err);
  }
};

const sessionSecret = process.env.SESSION_SECRET || 'keyboard cat';
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(session({													
  secret: 'supersecretkey',													
  resave: false,													
  saveUninitialized: true													
}));	
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/products');
  res.redirect('/users/login');
});
app.get('/products', (req, res) => {
  if (!req.session.user) return res.redirect('/users/login');
  res.render('products', { user: req.session.user });
});
const PORT = process.env.PORT || 3000;
startServer();
