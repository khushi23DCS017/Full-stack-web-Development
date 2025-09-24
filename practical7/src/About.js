import React from 'react';
import './App.css';

function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Charusat University</h1>
        <p>Learn more about our mission, vision, and values.</p>
      </section>
      <section className="about-content">
        <h2>Our Mission</h2>
        <p>To provide world-class education and foster research, innovation, and entrepreneurship for the betterment of society.</p>
        <h2>Our Vision</h2>
        <p>To be a global leader in higher education, empowering students to become responsible citizens and leaders of tomorrow.</p>
        <h2>Our Values</h2>
        <ul>
          <li>Excellence in Teaching & Research</li>
          <li>Integrity & Ethics</li>
          <li>Inclusivity & Diversity</li>
          <li>Collaboration & Innovation</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
