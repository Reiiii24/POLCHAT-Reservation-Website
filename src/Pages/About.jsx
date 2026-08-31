import ResortIntro from '../components/ResortIntro';
import ServiceList from '../components/ServiceList';
import ContactInfo from '../components/ContactInfo';

function About() {
  return (
    <div className="about-page">
      {/* About moves from story to services, then ends with contact details. */}
      <ResortIntro />
      <ServiceList />
      <ContactInfo />
    </div>
  );
}

export default About;