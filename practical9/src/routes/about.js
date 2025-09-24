const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <h1>About Page</h1>
        <nav>
            <a href="/">Home</a> |
            <a href="/about">About</a> |
            <a href="/contact">Contact</a>
        </nav>
        <p>This is the about page of our site.</p>
    `);
});

module.exports = router;
