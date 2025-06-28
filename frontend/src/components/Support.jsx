import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import '../styles/Support.css';

const Support = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const form = e.target;

    try {
      const res = await fetch("https://getform.io/f/aejlnlpb", {
        method: "POST",
        body: new FormData(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        form.reset();
      } else {
        throw new Error("Error");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="support-page">
      <Navbar />
      <div className="support-container">
        <h2 className="support-title">Support & Feedback</h2>
        <form className="support-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
        {status && <p className="support-status">{status}</p>}
      </div>
    </div>
  );
};

export default Support;
