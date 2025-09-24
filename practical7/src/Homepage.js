import React from "react";
import './App.css';

function Home() {
  return (
    <div className="homepage-container">
      <section className="homepage-hero">
        <h1>Welcome to Charusat University Portal</h1>
        <p>Empowering students and faculty with knowledge, innovation, and opportunities.</p>
      </section>
      <section className="homepage-about">
        <h2>About Charusat</h2>
        <p>
          Charotar University of Science and Technology (CHARUSAT) is a premier university in Gujarat, India, known for its excellence in education, research, and innovation. Our mission is to nurture talent and foster a culture of learning and growth.
        </p>
      </section>
      <section className="homepage-features">
        <h2>Explore Our Features</h2>
        <div className="grid">
          <div className="card">
            <h3>Modern Campus</h3>
            <p>State-of-the-art infrastructure and facilities for holistic development.</p>
          </div>
          <div className="card">
            <h3>Expert Faculty</h3>
            <p>Learn from experienced professors and industry leaders.</p>
          </div>
          <div className="card">
            <h3>Research & Innovation</h3>
            <p>Opportunities to participate in cutting-edge research and projects.</p>
          </div>
          <div className="card">
            <h3>Student Life</h3>
            <p>Vibrant campus life with clubs, events, and activities for everyone.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
