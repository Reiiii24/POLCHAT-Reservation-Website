// This file shows the about page with resort background and details.

import ResortIntro from '../components/ResortIntro';
import ServiceList from '../components/ServiceList';
import ContactInfo from '../components/ContactInfo';

function ServicesPage() {
  return (
    <div className="services-page">
      <div className="services-page-intro">
        <ResortIntro />
      </div>

      <div className="services-page-list">
        <ServiceList />
      </div>

      <div className="services-page-contact">
        <ContactInfo />
      </div>
    </div>
  );
}

export default ServicesPage;