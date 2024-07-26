import React, { useState } from "react";
import "./HelpAndSupport.css"; // Import your CSS file for styles
import Footer from "./Footer";

const HelpAndSupport = () => {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment by visiting our Bookings page and selecting the desired date and time.",
    },
    {
      question: "Can I cancel my appointment?",
      answer:
        "You cannot cancel your appointment directly. Please contact our customer care team for assistance with cancellations.",
    },
  ];

  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (index) => {
    setActiveSections((prevSections) =>
      prevSections.includes(index)
        ? prevSections.filter((section) => section !== index)
        : [...prevSections, index]
    );
  };

  return (
    <>
    <div className="container">
      <div className="help-and-support">
        <h2 className="header">Help and Support</h2>

        <div className="card">
          <div className="section-header">
            <span className="icon">
              <i className="icon-help-circle"></i>
            </span>
            <span className="section-header-text">Frequently Asked Questions</span>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleSection(index)}>
                <span className="faq-question-text">{faq.question}</span>
                <span className="icon">
                  <i className={`icon-caret ${activeSections.includes(index) ? 'up' : 'down'}`}></i>
                </span>
              </div>
              <div className={`faq-answer ${activeSections.includes(index) ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-header">
            <span className="icon">
              <i className="icon-call"></i>
            </span>
            <span className="section-header-text">Contact Us</span>
          </div>
          <div className="contact-item">
            <span className="icon">
              <i className="icon-phone"></i>
            </span>
            <span className="contact-text">Call Us: +91 78326238</span>
          </div>
          <div className="contact-item">
            <span className="icon">
              <i className="icon-envelope"></i>
            </span>
            <span className="contact-text">Email: support@example.com</span>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span className="icon">
              <i className="icon-people"></i>
            </span>
            <span className="section-header-text">Customer Support</span>
          </div>
          <p className="support-text">
            For any issues or inquiries, our customer support team is available
            24/7 to assist you. You can reach out to us via phone, email, or
            through our live chat feature on the website.
          </p>
        </div>
      </div>
    </div>
      <Footer/>
  </>
  );
};

export default HelpAndSupport;
