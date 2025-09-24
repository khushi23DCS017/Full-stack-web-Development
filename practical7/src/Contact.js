import React, { useState } from 'react';
import './App.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Fill out the form below or reach us at our contact details.</p>
      </section>
      <section className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
        {submitted && <div className="contact-success">Thank you for contacting us! We'll get back to you soon.</div>}
        <div className="contact-details">
          <h2>University Contact Details</h2>
          <p>Email: info@charusat.edu.in</p>
          <p>Phone: +91 2697 265011</p>
          <p>Address: CHARUSAT Campus, Changa, Gujarat, India</p>
        </div>
      </section>
    </div>
  );
}

export default Contact;
