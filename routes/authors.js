const express = require("express");
const router = express.Router();

const Author = require("../models/author");

// All authors route
// decs /authors
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, "i");
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render("authors/index", { authors, searchOptions: req.query });
    } catch (err) {
        res.redirect(`/`); // back to home page
    }
});

// New author route
// decs /authors/new
router.get("/new", (req, res) => {
    res.render("authors/new", { author: new Author() });
});

// Create author route
// decs /authors
router.post("/", (req, res) => {
    const newAuthor = new Author({ name: req.body.name });

    newAuthor
        .save()
        .then((author) => {
            // res.redirect(`authors/${newAuthor.id}`);
            res.redirect(`authors`);
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
