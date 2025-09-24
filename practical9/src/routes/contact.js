const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <h1>Contact Page</h1>
        <nav>
            <a href="/">Home</a> |
            <a href="/about">About</a> |
            <a href="/contact">Contact</a>
        </nav>
        <p>Get in touch with us!</p>
    `);
});

module.exports = router;
