if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "./layouts/layout");
app.use(methodOverride("_method"));
app.use(expressLayouts);
app.use(express.static("public"));

// connect to database
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    // we're connected!
    console.log("Connected to database");
});

app.use("/", indexRouter);

app.use("/authors", authorRouter);

app.use("/books", bookRouter);

// listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listens on port ${PORT}`);
});
