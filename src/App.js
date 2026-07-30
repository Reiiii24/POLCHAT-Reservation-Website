import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ResortIntro from './components/ResortIntro';
import ServiceList from './components/ServiceList';
import ReservationPage from './Pages/Reservation/ReservationPage';
import ContactInfo from './components/ContactInfo';
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
            <Route path="/contact" element={<ContactInfo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
