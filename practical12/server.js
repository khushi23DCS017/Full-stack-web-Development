const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submission
app.post("/calculate", (req, res) => {
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const operation = req.body.operation;

  // Input validation (check if numbers)
  if (isNaN(num1) || isNaN(num2)) {
    return res.send("<h2>❌ Invalid input! Please enter valid numbers.</h2>");
  }

  const a = parseFloat(num1);
  const b = parseFloat(num2);
  let result;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        return res.send("<h2>❌ Division by zero is not allowed!</h2>");
      }
      result = a / b;
      break;
    default:
      return res.send("<h2>❌ Invalid operation!</h2>");
  }

  res.send(`<h2>✅ Result: ${result}</h2> <a href="/">Back</a>`);
});

app.listen(port, () => {
  console.log(`Calculator app running at http://localhost:${port}`);
});
