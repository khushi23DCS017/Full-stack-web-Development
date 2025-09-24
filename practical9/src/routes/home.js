const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <h1>Home Page</h1>
        <nav>
            <a href="/">Home</a> |
            <a href="/about">About</a> |
            <a href="/contact">Contact</a>
        </nav>
        <p>Welcome to our website!</p>
    `);
});

module.exports = router;
