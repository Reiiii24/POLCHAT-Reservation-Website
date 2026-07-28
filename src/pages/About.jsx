import ResortIntro from '../components/ResortIntro';
import ServiceList from '../components/ServiceList';
import ContactInfo from '../components/ContactInfo';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <ResortIntro />
      <ServiceList />
      <ContactInfo />
    </div>
  );
}

export default About;