import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ResortIntro from './components/ResortIntro';
import ServiceList from './components/ServiceList';
import ReservationPage from './Pages/Reservation/ReservationPage';
import ContactInfo from './components/ContactInfo';
import SupportPage from "./Pages/Support/SupportPage";
import Direction from "./Pages/Direction/Direction";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={
              <>
                <ResortIntro />
                <ServiceList />
                <ContactInfo />
              </>
            } />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/direction" element={<Direction />} />
            <Route path="/contact" element={<ContactInfo />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
