// This file shows the list of resort services and guest options.

import './ServiceList.css';

// Keep the card content in one place so the section stays easy to reorder.
const services = [
  {
    id: 1,
    name: 'Resort Service',
    description: 'Explore our amenities, view available facilities, and prepare for a relaxing stay. To keep the atmosphere peaceful for everyone, we kindly ask all guests to observe our house rules, including noise policies and scheduled check-out times.',
  },
  {
    id: 2,
    name: 'Cottage & Room Rentals',
    description: 'Choose your preferred dates and lock in your stay with a 50% downpayment and a refundable ₱2,000 security deposit. Please note that we operate on a first-come, first-served basis—we do not offer pencil bookings, and downpayments are non-refundable once confirmed.',
  },
  {
    id: 3,
    name: 'Private Events & Day Tours',
    description: 'Plan your day trip or private celebration with us. Need a little extra time? Stay extensions are available upon request at ₱700/hr for day tours and ₱800/hr for night stays. We accept payments via Cash, GCash, and Bank Transfer (just send us a screenshot of your transfer receipt to confirm).',
  },
  {
    id: 4,
    name: 'Travel & Navigation',
    description: 'Get clear driving directions and check-in details before your trip. For peace of mind, your ₱2,000 security deposit covers incidental damage or missing items, and is processed back to you within 24 hours of check-out after a quick room check.',
  },
];

function ServiceList() {
  return (
    <section className="service-list">
      <div className="section-heading">
        <p>Services Overview</p>
        <h2>Our Services</h2>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServiceList;
