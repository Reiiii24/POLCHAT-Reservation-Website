import './ServiceList.css';

const services = [
  {
    id: 1,
    icon: '🏝️',
    name: 'Resort Service',
    description: 'How to go up on the web app for viewing amenities.',
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
      <h2 className="section-title">Our Services</h2>
      <div className="service-cards">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="icon-placeholder">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceList;