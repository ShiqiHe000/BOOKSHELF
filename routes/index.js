const express = require('express');

const router = express.Router();

// @route GET 
// @desc /
// @access Public 
router.get('/', (req, res) => {
    res.render('index'); 
})

module.exports = router;