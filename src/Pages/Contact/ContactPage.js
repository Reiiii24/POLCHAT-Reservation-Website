import ContactInfo from '../../components/ContactInfo';
import './ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-page-hero">
        <div className="contact-page-shell">
          <div className="contact-page-copy">
            <p className="contact-page-kicker">Contact Us</p>
            <h1>We are here to help you plan your stay.</h1>
            <p className="contact-page-lead">
              Reach out to PolChat Garden Resort for bookings, questions,
              directions, and event inquiries. You can contact us using the
              details below.
            </p>
          </div>

          <div className="contact-page-grid">
            <article className="contact-page-card">
              <h2>Call or Text</h2>
              <a href="tel:+639156418828">+63 915 641 8828</a>
              <p>Best for quick inquiries and reservation follow-ups.</p>
            </article>

            <article className="contact-page-card">
              <h2>Email</h2>
              <a href="mailto:reamydaine8@gmail.com">reamydaine8@gmail.com</a>
              <p>Use email for detailed questions and event coordination.</p>
            </article>

            <article className="contact-page-card">
              <h2>Visit Us</h2>
              <p>
                Blk 5 Lot 1 Jamesa Street Balitao Subdivision, Taktak Road
                Brgy Sta Cruz, Antipolo City, Rizal, Philippines
              </p>
            </article>

            <article className="contact-page-card">
              <h2>Operating Hours</h2>
              <p>Monday - Sunday</p>
              <p>8:00 AM - 10:00 PM</p>
            </article>
          </div>
        </div>
      </section>

      <ContactInfo />
    </div>
  );
}

export default ContactPage;
