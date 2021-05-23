const express = require("express");
const router = express.Router();
const Book = require("../models/book.js");

// @route GET
// @desc /
// @access Public
router.get("/", async (req, res) => {
    try {
        const books = await Book.find({})
            .sort({ createAt: "desc" })
            .limit(3)
            .exec();
        res.render("index", { books });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
