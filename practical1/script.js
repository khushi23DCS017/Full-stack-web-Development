// Object to store vote counts
let votes = {
  JavaScript: 0,
  Python: 0,
  Java: 0
};

// Called when a vote button is clicked
function vote(language) {
  votes[language]++;
  updateVotes();
}

// Update the vote display in the UI
function updateVotes() {
  document.getElementById("js").innerText = votes.JavaScript;
  document.getElementById("py").innerText = votes.Python;
  document.getElementById("java").innerText = votes.Java;
}

// Simulate other users voting every 2 seconds
setInterval(() => {
  let languages = ["JavaScript", "Python", "Java"];
  let randomLang = languages[Math.floor(Math.random() * languages.length)];
  votes[randomLang]++;
  updateVotes();
}, 2000);

// Show initial values
updateVotes();
