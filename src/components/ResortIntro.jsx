// This file introduces the resort and gives a quick overview for visitors.

import ServicesPageImage from '../Assets/servicesPage.png';
import NatureSerenity from '../Assets/NatureSerenity.jpg';
import Cottages from '../Assets/Cottages.jpg';
import TrustedImage from '../Assets/trusted .jpg';
import './ResortIntro.css';

const reasons = [
  {
    id: 1,
    title: 'Nature & Serenity',
    description:
      'Escape the noise. Our lush green gardens and refreshing pools offer the perfect peaceful environment to unwind with family and friends.',
    image: NatureSerenity,
  },
  {
    id: 2,
    title: 'Affordable Comfort',
    description:
      'Enjoy premium amenities, cozy cottages, and private event spaces tailored to fit your family staycation or corporate budget.',
    image: Cottages,
  },
  {
    id: 3,
    title: 'Trusted Service',
    description:
      'A secure and reliable booking experience backed by verified reservations and responsive guest support.',
    image: TrustedImage,
  },
];

function ResortIntro() {
  return (
    <section className="resort-intro">
      <div className="intro-shell">
        <div className="intro-story">
          <p className="intro-kicker">About the Resort</p>
          <div className="intro-copy">
            <h1>How Polchat Came To Be?</h1>
            <p>
              Our story began with our parents' love for nature. They spent years cultivating landscaping services and planting a wide variety of flora around our property. What started with lush greenery soon expanded into a cozy retreat featuring a classic Bahay Kubo, a fun Tree House, and an inflatable pool for quick cooling off.
            </p>

            <p>
              Seeing the joy these simple elements brought to family and friends, my brother had a bigger vision: why not turn our green sanctuary into a full-fledged resort? Encouraged by his idea, we officially launched our business in 2020, and by 2021-2022, we upgraded our simple setups with a permanent swimming pool.
            </p>
            <p>Today, PotChat is fully family-owned and operated:</p>

            <p>
              Our Parents manage the day-to-day operations on-site, ensuring every corner of the property stays welcoming, clean, and beautiful. Whether you're looking for a peaceful getaway surrounded by nature or a fun swimming day with your loved ones, our family is here to welcome yours!
            </p>
          </div>
        </div>
        <div className="intro-image-slot">
          <img src={ServicesPageImage} alt="PolChat Garden Resort" className="intro-image" />
        </div>
      </div>

      <div className="section-heading">
        <p>So Why Choose PolChat?</p>
        <h2>Reasons Why You Should Choose PolChat Garden Resort</h2>
      </div>

      <div className="why-grid">
        {reasons.map((reason) => (
          <article className="why-card" key={reason.id}>
            <div className="why-card-copy">
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </div>
            <div className="why-image-slot">
              <img src={reason.image} alt={reason.title} className="why-image" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResortIntro;
