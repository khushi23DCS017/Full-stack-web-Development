const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "librarySecretKey",  // secret key to encrypt session
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // session expires in 30 min
}));

// Serve static HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

// Login route
app.post("/login", (req, res) => {
  const { name } = req.body;
  if(name) {
    req.session.user = {
      name: name,
      logintime: new Date().toLocaleString()
    };
    res.redirect("/profile");
  } else {
    res.send("Please enter your name.");
  }
});

// Profile page
app.get("/profile", (req, res) => {
  if(req.session.user) {
    // Replace placeholders with session data
    let profileHtml = require("fs").readFileSync(path.join(__dirname, "views/profile.html"), "utf8");
    profileHtml = profileHtml.replace("{{name}}", req.session.user.name)
                             .replace("{{logintime}}", req.session.user.logintime);
    res.send(profileHtml);
  } else {
    res.redirect("/");
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if(err) {
      return res.send("Error logging out.");
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
