const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const sessionSecret = process.env.SESSION_SECRET || "keyboard cat";
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
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

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/products");
  res.redirect("/users/login");
});

app.get("/products", (req, res) => {
  if (!req.session.user) return res.redirect("/users/login");
  res.render("products", { user: req.session.user });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

startServer();
