const path = require("path");
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "frontend", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionSecret = process.env.SESSION_SECRET || "keyboard cat";
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://localhost:27017/food_lib_adv",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use(
  "/public",
  express.static(path.join(__dirname, "..", "frontend", "public")),
);

app.use("/users", userRoutes);
app.use("/", pageRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Food-Lib-Adv running: http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exitCode = 1;
});
