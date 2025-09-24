const express = require("express");
const app = express();

// Import routes
const homeRoute = require("./routes/home");
const aboutRoute = require("./routes/about");
const contactRoute = require("./routes/contact");

// Use routes
app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/contact", contactRoute);

module.exports = app;
