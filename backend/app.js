const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const pageRoutes = require('./routes/pageRoutes');
const foodRoutes = require('./routes/foodRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { ensureSeeded } = require('./controllers/foodController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Bug 3 fix: không dùng fallback "keyboard cat" (không an toàn).
// - Production: bắt buộc phải set SESSION_SECRET.
// - Dev: nếu chưa set thì tạo secret ngẫu nhiên cho phiên chạy hiện tại.
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing SESSION_SECRET environment variable (required in production).');
  }
  sessionSecret = crypto.randomBytes(32).toString('hex');
  console.warn('[Session] SESSION_SECRET chưa được set. Đang dùng secret ngẫu nhiên cho DEV.');
}
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/food_lib_adv'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// REST API
app.use('/api/foods', foodRoutes);
app.use('/api/profile', profileRoutes);

// Pages / Auth
app.use('/users', userRoutes);
app.use('/', pageRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  try {
    await ensureSeeded();
  } catch (err) {
    console.warn('[Food] Seed lỗi (bỏ qua):', err.message);
  }
  app.listen(PORT, () => {
    console.log(`Food-Lib-Adv running: http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exitCode = 1;
});

