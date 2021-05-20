const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


// All books route
// decs /books
router.get("/", async (req, res) => {

    let query = Book.find();
    if(req.query.title != null && req.query.title !== ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    //published before 
    if(req.query.publishedBefore != null && req.query.publishedBefore !== ''){
        query = query.lte('publishedDate', req.query.publishedBefore);
    }
    // publishedAfter
    if(req.query.publishedAfter != null && req.query.publishedAfter !== ''){
        query = query.gte('publishedDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        res.render("books/index", { books, searchOptions: req.query });
    } catch (err) {
        res.redirect("/");
    }
});

// New book route
// decs /books/new
router.get("/new", async (req, res) => {
    renderNewBook(res, new Book());
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
        // res.redirect(`books/${book.id}`);

        res.redirect("/books");
    } catch (err) {
        console.log(err);
        renderNewBook(res, newBook, true);
    }
});

function saveCover(book, coverEncoded){
    if(coverEncoded == null) {
        return console.log('Encodes cover is null.');
    }

    const cover = JSON.parse(coverEncoded);

    if(cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }

}



async function renderNewBook(res, book, hasErr = false) {
    try {
        const authors = await Author.find({});
        const params = {
            book,
            authors,
        };
        if (hasErr) {
            params.errorMessage = "Error Creating Book";
        }

        res.render("books/newBook.ejs", params);
    } catch (err) {
        res.redirect("/books");
    }
}

module.exports = router;
