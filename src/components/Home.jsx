// This file shows the home page with the main resort highlights and actions.

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Logo from './Logo';
import './Home.css';
import highlightOne from '../Assets/highlights/464e8f4b-a857-4bd6-8544-eeffc3aafb7d.jpg';
import highlightTwo from '../Assets/highlights/94d6c56f-eb43-444d-94c7-ead680ef5746.jpg';
import highlightThree from '../Assets/highlights/70ad26fd-b3a9-49d1-acca-13c9374158bf.jpg';
import highlightFour from '../Assets/highlights/ef2e169b-48b4-488c-a79d-a15db3259fe8.jpg';
import highlightFive from '../Assets/highlights/898bc056-1ddd-4405-a871-9b82077f2a7c.jpg';
import highlightSix from '../Assets/highlights/e11826fa-e741-4226-abfd-fb90f1a3fbba.jpg';

const formatDateTimeForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Trim the timestamp to the date part expected by the availability check.
const getDateKey = (dateString) => dateString.slice(0, 10);

// Keep the result message natural for one guest or many.
const formatGuestsLabel = (guests) => `${guests} ${Number(guests) === 1 ? 'Guest' : 'Guests'}`;

export default function Home() {
  const navigate = useNavigate();
  const initialCheckIn = new Date();
  initialCheckIn.setMinutes(0, 0, 0);
  initialCheckIn.setHours(initialCheckIn.getHours() + 1);

  const initialCheckOut = new Date(initialCheckIn);
  initialCheckOut.setDate(initialCheckOut.getDate() + 1);

  const [availabilityForm, setAvailabilityForm] = useState({
    checkIn: formatDateTimeForInput(initialCheckIn),
    checkOut: formatDateTimeForInput(initialCheckOut),
    guests: '2',
  });
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryDragOffset, setGalleryDragOffset] = useState(0);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const galleryDragStart = useRef(null);

  const galleryImages = [
    highlightOne,
    highlightTwo,
    highlightThree,
    highlightFour,
    highlightFive,
    highlightSix,
  ];

  const moveGallery = (direction) => {
    setGalleryIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), galleryImages.length - 4);
    });
  };

  const handleGalleryPointerDown = (event) => {
    galleryDragStart.current = {
      x: event.clientX,
      index: galleryIndex,
    };
    setGalleryDragOffset(0);
    setIsDraggingGallery(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleGalleryPointerMove = (event) => {
    if (galleryDragStart.current === null) return;
    setGalleryDragOffset(event.clientX - galleryDragStart.current.x);
  };

  const handleGalleryPointerUp = (event) => {
    if (galleryDragStart.current !== null) {
      const dragDistance = event.clientX - galleryDragStart.current.x;
      if (Math.abs(dragDistance) > 60) {
        moveGallery(dragDistance < 0 ? 1 : -1);
      }
    }

    galleryDragStart.current = null;
    setGalleryDragOffset(0);
    setIsDraggingGallery(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleAvailabilityChange = ({ target }) => {
    const { name, value } = target;

    setAvailabilityForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setAvailabilityError('');
  };

  // Validate the quick form first, then check the selected dates in Supabase.
  const handleCheckAvailability = async () => {
    const { checkIn, checkOut, guests } = availabilityForm;

    if (!checkIn || !checkOut || !guests) {
      setAvailabilityError('Complete the check-in, check-out, and guests fields.');
      setAvailabilityStatus('');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestCount = Number(guests);
    const now = new Date();

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      setAvailabilityError('Enter valid check-in and check-out values.');
      setAvailabilityStatus('');
      return;
    }

    if (checkInDate < now) {
      setAvailabilityError('Check-in must be a future date and time.');
      setAvailabilityStatus('');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setAvailabilityError('Check-out must be later than check-in.');
      setAvailabilityStatus('');
      return;
    }

    if (guestCount < 1) {
      setAvailabilityError('Guests must be at least 1.');
      setAvailabilityStatus('');
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityError('');
    setAvailabilityStatus('');

    try {
      const { data, error } = await supabase.rpc('get_confirmed_reservation_availability', {
        p_start_date: getDateKey(checkInDate.toISOString()),
        p_end_date: getDateKey(checkOutDate.toISOString()),
      });

      if (error) {
        setAvailabilityError('Availability could not be checked right now.');
        return;
      }

      const bookedDays = (data || []).filter((item) => item.availability_status === 'unavailable' || item.availability_status === 'partial');
      setAvailabilityStatus(
        bookedDays.length === 0
          ? `Available for ${formatGuestsLabel(guests)}.`
          : 'Not available for the selected dates.'
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-overlay" />

        <div className="home-shell">
          <div className="home-hero-copy">
            <h1>
              Welcome to
              <br />
              PolChat Garden Resort!
            </h1>
            <p className="home-subcopy">
              A brief escape to reconnect, refresh, and recharge your energy.
            </p>
          

            <div className="home-actions">
              <button
                type="button"
                className="home-btn home-btn-primary"
                onClick={() => navigate('/services')}
              >
                Explore Resort
              </button>
            </div>
          </div>

        </div>

        <div className="booking-strip-wrap">
          <div className="booking-strip" role="search" aria-label="Check availability form">
            <label className="booking-field">
              <small>Check-in</small>
              <input
                type="datetime-local"
                name="checkIn"
                value={availabilityForm.checkIn}
                onChange={handleAvailabilityChange}
              />
            </label>
            <label className="booking-field">
              <small>Check-out</small>
              <input
                type="datetime-local"
                name="checkOut"
                value={availabilityForm.checkOut}
                onChange={handleAvailabilityChange}
              />
            </label>
            <label className="booking-field">
              <small>Guests</small>
              <input
                type="number"
                name="guests"
                min="1"
                value={availabilityForm.guests}
                onChange={handleAvailabilityChange}
              />
            </label>
            <div className="booking-action">
              {availabilityError && <p className="booking-error">{availabilityError}</p>}
              {availabilityStatus && <p className="booking-status">{availabilityStatus}</p>}
              <button type="button" className="booking-button" onClick={handleCheckAvailability} disabled={isCheckingAvailability}>
                {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-why">
        <div className="section-heading">
          <h2>Your Perfect Getaway Awaits...</h2>
        </div>

        <div className="why-grid">
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M12 3c3.9 2 6.2 6 6.2 10.1 0 4.2-2.8 7.7-6.2 7.7s-6.2-3.5-6.2-7.7C5.8 9 8.1 5 12 3Zm0 3.1c-2.4 1.7-3.9 4.6-3.9 7 0 2.8 1.7 5.1 3.9 5.1s3.9-2.3 3.9-5.1c0-2.4-1.5-5.3-3.9-7Z" />
                <path d="M12 9.2c1.3 1 2.2 2.5 2.2 4 0 1.9-1.1 3.4-2.2 3.4S9.8 15.1 9.8 13.2c0-1.5.9-3 2.2-4Z" />
              </svg>
            </div>
            <div>
              <h3>Surrounded by Nature</h3>
              <p>Lush greenery and fresh air to soothe your soul.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M7 10c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.5-.7 2.9-1.8 3.8l-1 4.2H9.8l-1-4.2C7.7 12.9 7 11.5 7 10Z" />
                <path d="M9.5 18.5h5V21h-5zM8.2 7.8 6 5.6l1.4-1.4 2.2 2.2zm10.6 0-1.4-1.4 2.2-2.2L21 5.6zm.7 2.2H21v2h-2.5zm-14.7 0H3.9v2H4.8z" />
              </svg>
            </div>
            <div>
              <h3>Clean &amp; Relaxing</h3>
              <p>Well-maintained facilities designed for comfort.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M4 9.5c1.8-2.2 4.2-3.4 7-3.4s5.2 1.2 7 3.4v8.3h-2V10.7c-1.3-1.3-3-2-5-2s-3.7.7-5 2v7.1H4V9.5Z" />
                <path d="M9 13h6v4H9zM7 17h10v2H7z" />
              </svg>
            </div>
            <div>
              <h3>Perfect for Everyone</h3>
              <p>Great for family stays, barkada trips, and events.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="m12 20.3-1.3-1.2C5.9 14.6 3 11.9 3 8.6 3 6 5 4 7.6 4c1.5 0 2.9.7 3.8 1.8C12.3 4.7 13.7 4 15.2 4 17.8 4 19.8 6 19.8 8.6c0 3.3-2.9 6-7.7 10.5L12 20.3Z" />
              </svg>
            </div>
            <div>
              <h3>Memories That Last</h3>
              <p>Create meaningful moments with the people you love.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M5 13.5A7 7 0 0 1 12 6a7 7 0 0 1 7 7.5h-2.2c0-2.9-2-5.1-4.8-5.1s-4.8 2.2-4.8 5.1H5Z" />
                <path d="M7 14h10l2 6H5l2-6Z" />
                <path d="M10.5 10.2h3v6h-3z" />
              </svg>
            </div>
            <div>
              <h3>Refreshing Pool Access</h3>
              <p>Cool down and enjoy refreshing dips under the open sky.</p>
            </div>
          </article>
          <article className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M12 2 4.5 5.6v6.2c0 4.9 3.4 8.9 7.5 10.2 4.1-1.3 7.5-5.3 7.5-10.2V5.6L12 2Z" />
                <path d="m9.3 12.2 1.9 1.9 3.7-3.7 1.4 1.4-5.1 5.1-3.3-3.3 1.4-1.4Z" />
              </svg>
            </div>
            <div>
              <h3>Accessible Location</h3>
              <p>Conveniently located in Antipolo.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="home-story">
        <div className="story-content">
          <h2>PolChat Garden Resort</h2>
          <p>
            is designed to give you a warm, refreshing experience — perfect for family outings,
            barkada bonding, birthday celebrations, and simply taking a break.
          </p>
        </div>
      </section>

      <section className="home-gallery">
        <div className="section-heading">  {/*for photos*/}
         {/*<p>Photo Highlights</p>*/}
          <h2>Photo Highlights from PolChat Garden Resort</h2>
        </div>

        <div className="gallery-slider">
          <button
            className="gallery-arrow gallery-arrow-prev"
            type="button"
            onClick={() => moveGallery(-1)}
            disabled={galleryIndex === 0}
            aria-label="Show previous photos"
          >
            &#8592;
          </button>

          <div
            className={`gallery-viewport${isDraggingGallery ? ' is-dragging' : ''}`}
            onPointerDown={handleGalleryPointerDown}
            onPointerMove={handleGalleryPointerMove}
            onPointerUp={handleGalleryPointerUp}
            onPointerCancel={handleGalleryPointerUp}
          >
            <div
              className="home-gallery-track"
              style={{
                transform: `translateX(calc(-${galleryIndex} * (25% + 4.5px) + ${galleryDragOffset}px))`,
              }}
            >
              {galleryImages.map((image, index) => (
                <div className="image-slot" key={image}>
                  <img
                    src={image}
                    alt={`PolChat Garden Resort highlight ${index + 1}`}
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="gallery-arrow gallery-arrow-next"
            type="button"
            onClick={() => moveGallery(1)}
            disabled={galleryIndex === galleryImages.length - 4}
            aria-label="Show next photos"
          >
            &#8594;
          </button>
        </div>

        <div className="gallery-button-wrap">
          <a className="gallery-explore-button" href="/gallery">
            Explore Gallery
          </a>
        </div>
      </section>

      <section className="home-services-brief">
        <div className="services-brief-panel">
          <div className="section-heading section-heading-left">
          
            <h2> Services of PolChat Garden Resort</h2>
          </div>

          <div className="services-brief-grid">
            <article className="services-brief-card">
              <h3>Day Tour Access</h3>
              <p>
                Enjoy a relaxing day surrounded by nature with access to open
                cottages, garden spaces, and resort amenities.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Room Stays</h3>
              <p>
                Stay overnight in comfortable rooms designed for restful
                weekends, family trips, and quiet staycations.
              </p>
            </article>
            <article className="services-brief-card">
              <h3>Events &amp; Gatherings</h3>
              <p>
                Host birthdays, reunions, and special celebrations in a warm
                garden setting made for shared moments.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-footnote">
        <div className="footer-box">
          <div className="footer-top">
            <div className="footer-column footer-brand-column">
              <div className="footer-brand">
                <Logo size={40} className="footer-logo" />
                <div>
                  <p className="footer-brand-name">PolChat</p>
                  <p className="footer-brand-sub">Garden Resort</p>
                </div>
              </div>
              <p className="footer-brand-text">
                Perfect for those who seek comfort,
                Refocusing on the good vibes & 
                Regenerating energy from within.
              </p>
              <div className="footer-socials" aria-label="Social links">
                <a href="/" className="footer-social">f</a>
                <a href="/" className="footer-social">ig</a>
                <a href="/" className="footer-social">p</a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/services">About Us</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-contact-list">
                <li>+63 915 841 0828</li>
                <li>marrydianae8@gmail.com</li>
                <li>
                  Blk 5 Lot 1 James Street Baltao Subdivision, 
                  Taktak Road Brgy Sta Cruz, Antipolo City, Antipolo, Philippines, 1870
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Operating Hours</h3>
              <div className="footer-hours">
                <p>Monday - Sunday</p>
                <p>8:00 AM - 10:00 PM</p>
              </div>
              <blockquote className="footer-quote">
                "Relax. Recharge.
                <br />
                Reconnect with Nature."
              </blockquote>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-bottom-icon" aria-hidden="true">❦</span>
            <p>© 2020 PolChat Garden Resort. All Rights Reserved.</p>
            <span className="footer-bottom-icon" aria-hidden="true">❦</span>
          </div>
        </div>
      </section>
    </div>
  );
}
