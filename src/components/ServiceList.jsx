import './ServiceList.css';

const services = [
  {
    id: 1,
    icon: '🏝️',
    name: 'Resort Service',
    description: 'How to access and view amenities through the web app.',
  },
  {
    id: 2,
    icon: '🛏️',
    name: 'Cottage & Room Rentals',
    description: 'Select your check-in date on the Booking Panel to see available rooms.',
  },
  {
    id: 3,
    icon: '🎉',
    name: 'Private Events & Day Tours',
    description: 'Fill out our quick Digital Inquiry Form for instant reservation approval.',
  },
  {
    id: 4,
    icon: '🗺️',
    name: 'Travel & Navigation',
    description: 'Access the Embedded Google Map and download the Offline Route PDF.',
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
            <div className="service-icon">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServiceList;