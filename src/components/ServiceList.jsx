import './ServiceList.css';

const services = [
  {
    id: 1,
    name: 'Resort Service',
    description: 'How to access and view amenities through the web app.',
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M4 11.5 12 4l8 7.5v8.5h-5v-5H9v5H4v-8.5Z" />
        <path d="M10.4 12.4h3.2V10h-3.2v2.4Z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Cottage & Room Rentals',
    description: 'Select your check-in date on the Booking Panel to see available rooms.',
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M5 9.5A2.5 2.5 0 0 1 7.5 7h9A2.5 2.5 0 0 1 19 9.5V19H5V9.5Z" />
        <path d="M7.2 11.5h9.6v2H7.2z" />
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7h-2V6h-2v1H9Z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Private Events & Day Tours',
    description: 'Fill out our quick Digital Inquiry Form for instant reservation approval.',
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M12 3 9.4 8.2 4 9l3.9 3.8-.9 5.4L12 15.7l5 2.5-.9-5.4L20 9l-5.4-.8L12 3Z" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Travel & Navigation',
    description: 'Access the Embedded Google Map and download the Offline Route PDF.',
    icon: (
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d="M12 2 5 5.2v13.6L12 22l7-3.2V5.2L12 2Zm0 2.2 4.8 2.2-4.8 2.3-4.8-2.3L12 4.2Zm-5 4.3 4 1.9v7.1l-4-1.8V10.5Zm6 9v-7.1l4-1.9v7.2l-4 1.8Z" />
      </svg>
    ),
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