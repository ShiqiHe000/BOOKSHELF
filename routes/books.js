const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// All books route
// decs /books
router.get("/", async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title !== "") {
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }
    //published before
    if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
        query = query.lte("publishedDate", req.query.publishedBefore);
    }
    // publishedAfter
    if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
        query = query.gte("publishedDate", req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        res.render("books/index", { books, searchOptions: req.query });
    } catch (err) {
        res.redirect("/");
    }
});

// Dispay new book route
// desc /books/new
router.get("/new", async (req, res) => {
    renderNewBook(res, new Book());
});

// Select a book by id
// desc /books/:id
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("author")
            .exec();
        res.render("books/show.ejs", { book });
    } catch (err) {
        console.log(err);
        redirect("/books");
    }
});

// Edit book
// desc: /books/:id/edit
router.get("/:id/edit", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditBook(res, book);
    } catch (err) {
        console.log(err);
        res.redirect("/books");
    }
});

// Update Book
// desc: /books/:id
router.put("/:id", async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);

        book.title = req.body.title;
        book.description = req.body.description;
        book.publishedDate = new Date(req.body.publishedDate);
        book.pageCount = req.body.pageCount;
        book.createAt = Date.now();
        book.author = req.body.author;
        if (req.body.coverImage != null && req.body.coverImage !== "") {
            saveCover(book, req.body.coverImage);
        }
        await book.save();
        res.redirect(`/books/${book._id}`);
    } catch (err) {
        console.log(err);

        if (book == null) {
            console.log("cannot find this book in the database");
            res.redirect("/books");
        } else {
            // error in edit page
            return renderEditBook(res, book, true);
        }
    }
});

// Delete book by ID
// decs: /books/:id
router.delete("/:id", async (req, res) => {
    try {
        const response = await Book.deleteOne({ _id: req.params.id });
        if (response.deletedCount > 0) {
            console.log("Deleted one book.");
        } else {
            console.log("Book not found");
        }
        res.redirect("/books");
    } catch (err) {
        console.log(err);
        res.redirect("/books");
    }
});

// Create book route
// decs /books
router.post("/", async (req, res) => {
    const newBook = new Book({
        title: req.body.title,
        description: req.body.description,
        publishedDate: new Date(req.body.publishedDate),
        pageCount: req.body.pageCount,
        createAt: Date.now(),
        author: req.body.author,
    });

    saveCover(newBook, req.body.coverImage);
    try {
        const book = await newBook.save();
        res.redirect(`books/${book._id}`);
    } catch (err) {
        console.log(err);
        renderNewBook(res, newBook, true);
    }
});

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) {
        return console.log("Encodes cover is null.");
    }

    const cover = JSON.parse(coverEncoded);

    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
}

async function renderEditBook(res, book, hasErr = false) {
    renderEditForm(res, book, "edit.ejs", hasErr);
}

async function renderNewBook(res, book, hasErr = false) {
    renderEditForm(res, book, "newBook.ejs", hasErr);
}

// render edit form to create new book or edit book.
// form: the ejs form to render
async function renderEditForm(res, book, form, hasErr) {
    try {
        const authors = await Author.find({});
        const params = {
            book,
            authors,
        };
        if (hasErr) {
            if (form === "edit.ejs") {
                params.errorMessage = "Error Updating Book";
            } else if (form === "newBook.ejs") {
                params.errorMessage = "Error Creating Book";
            }
        }

        res.render(`books/${form}`, params);
    } catch (err) {
        res.redirect("/books");
    }
}

module.exports = router;
