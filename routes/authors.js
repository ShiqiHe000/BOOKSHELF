const express = require("express");
const { findOne, findById } = require("../models/author");
const router = express.Router();

const Author = require("../models/author");
const Book = require("../models/book");

// All authors route
// decs /authors
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
        const searchName = req.query.name.trim();
        searchOptions.name = new RegExp(searchName, "i");
    }
    try {
        const authors = await Author.find(searchOptions);
        let noResult = false;
        if(authors.length === 0) noResult = true;
        res.render("authors/index", { authors, searchOptions: req.query, noResult });
    } catch (err) {
        console.log(err);
        res.redirect(`/`); // back to home page
    }
});

// New author route
// GET
// decs /authors/new
router.get("/new", (req, res) => {
    res.render("authors/new", { author: new Author() });
});

// Get a specific author
// GET
// decs: /authors/:id
router.get("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);

        if (author == null) {
            res.redirect("/authors");
            console.log("author not found");
            return;
        }

        const books = await Book.find({ author: req.params.id })
            .limit(6)
            .exec();
        res.render("authors/show.ejs", {
            author,
            url: `/authors/${req.params.id}`,
            books,
        });
    } catch (err) {
        console.log(err);
    }
});

// Edit a specific author
// GET
// decs: /authors/:id/edit
router.get("/:id/edit", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render("authors/edit", { author });
    } catch (err) {
        console.error(err);
        res.redirect("/authors");
    }
});

// Update author
// PUT
// desc: /authors/:id
router.put("/:id", async (req, res) => {
    let author;

    try {
        author = await Author.findById(req.params.id);

        author.name = req.body.name;

        await author.save();
        res.redirect(`/authors/${req.params.id}`);
    } catch (err) {
        if (author == null) {
            console.log("Error: cannot find author in database.");
            res.redirect("/authors");
        } else {
            res.render(`/authors/edit.ejs`, {
                author,
                errorMessage: "Error updating the author.",
            });
        }
    }
});

// delete author
// DELETE
// desc: /authors/:id
router.delete("/:id", async (req, res) => {
    try {
        const response = await Author.deleteOne({ _id: req.params.id });
        if (response.deletedCount === 1) {
            console.log("Delete one author.");
        }
        res.redirect(`/authors`);
    } catch (err) {
        console.log(err);
        res.redirect(`/authors/${req.params.id}`);
    }
});

// Create author route
// decs /authors
router.post("/", (req, res) => {
    const newAuthor = new Author({ name: req.body.name });

    newAuthor
        .save()
        .then((author) => {
            res.redirect(`authors/${newAuthor.id}`);
        })
        .catch((err) => {
            res.render("authors/new", {
                author: newAuthor,
                errorMessage: "Error creating author.",
            });
            console.log(err);
        });
});

module.exports = router;
