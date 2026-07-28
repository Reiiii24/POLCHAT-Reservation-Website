import './ContactInfo.css';

function ContactInfo() {
  return (
    <section className="contact-info">
      <div className="contact-details">
        <h2>Contact Us</h2>
        <ul>
          <li>
            <strong>Address:</strong> Blk 5 Lot 1 Jamesa Street Balitao
            Subdivision, Taktak Road Brgy Sta Cruz, Antipolo City,
            Philippines, 1870
          </li>
          <li>
            <strong>Mobile:</strong> +63 915 641 8828
          </li>
          <li>
            <strong>Email:</strong> reamydaine8@gmail.com
          </li>
          <li>
            <strong>Facebook:</strong>{' '}
            
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            <li>
              PolChat Garden and Landscaping Services
            </li>
          </li>
        </ul>
      </div>

      <div className="contact-quote">
        <p>"Every stay is a memory, every moment is yours to keep"</p>
      </div>

      <div className="chat-button-placeholder">💬</div>

      <p className="copyright">
        © 2025 PolChat Garden Resort. All Rights Reserved.
      </p>
    </section>
  );
}

export default ContactInfo;