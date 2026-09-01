// This file shows the resort location and opens directions in Google Maps.

import "./Direction.css";


/* ==========================================
   POLCHAT LOCATION
   ========================================== */

const POLCHAT_DESTINATION =
  "Blk 5 Lot 1 James Street, Baltao Subdivision, Taktak Road, Brgy Sta Cruz, Antipolo City, Antipolo, Philippines, 1870";


export default function Direction() {

  /* ========================================
     OPEN DIRECTIONS
     ======================================== */

  const openDirections = (
    latitude = null,
    longitude = null
  ) => {

    const encodedDestination =
      encodeURIComponent(
        POLCHAT_DESTINATION
      );


    /*
      Standard Google Maps website URL.

      This becomes our fallback if the
      Google Maps app cannot be opened.
    */

    let browserUrl =
      "https://www.google.com/maps/dir/?api=1";


    if (
      latitude !== null &&
      longitude !== null
    ) {

      browserUrl +=
        `&origin=${latitude},${longitude}`;

    }


    browserUrl +=
      `&destination=${encodedDestination}` +
      "&travelmode=driving";


    /* ======================================
       DEVICE DETECTION
       ====================================== */

    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      window.opera;


    const isAndroid =
      /android/i.test(
        userAgent
      );


    const isIOS =
      /iPad|iPhone|iPod/.test(
        userAgent
      ) &&
      !window.MSStream;


    /* ======================================
       ANDROID
       ====================================== */

    if (isAndroid) {

      /*
        Android Intent:

        If Google Maps is installed,
        Android opens the Google Maps app.

        If Google Maps is not installed,
        browser_fallback_url opens the
        Google Maps website instead.
      */

      const googleMapsPath =
        latitude !== null &&
        longitude !== null
          ? `maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedDestination}&travelmode=driving`
          : `maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;


      const androidIntent =
        `intent://www.google.com/${googleMapsPath}` +
        "#Intent;" +
        "scheme=https;" +
        "package=com.google.android.apps.maps;" +
        `S.browser_fallback_url=${encodeURIComponent(
          browserUrl
        )};` +
        "end";


      window.location.href =
        androidIntent;

      return;

    }


    /* ======================================
       IOS
       ====================================== */

    if (isIOS) {

      /*
        Google Maps' iOS URL scheme.

        We first attempt to open the app.
        If the page remains visible,
        Google Maps probably was not
        available, so we use the browser.
      */

      let googleMapsAppUrl =
        "comgooglemaps://?";


      if (
        latitude !== null &&
        longitude !== null
      ) {

        googleMapsAppUrl +=
          `saddr=${latitude},${longitude}&`;

      }


      googleMapsAppUrl +=
        `daddr=${encodedDestination}` +
        "&directionsmode=driving";


      let fallbackTimer;


      const handleVisibilityChange =
        () => {

          /*
            If the browser becomes hidden,
            the Maps app successfully opened.

            Cancel the browser fallback.
          */

          if (
            document.hidden &&
            fallbackTimer
          ) {

            clearTimeout(
              fallbackTimer
            );

          }

        };


      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );


      fallbackTimer =
        setTimeout(
          () => {

            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );


            /*
              Google Maps app did not open,
              so use the browser instead.
            */

            window.location.href =
              browserUrl;

          },
          1500
        );


      window.location.href =
        googleMapsAppUrl;

      return;

    }


    /* ======================================
       DESKTOP / OTHER DEVICES
       ====================================== */

    window.open(
      browserUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  /* ========================================
     GET CURRENT LOCATION
     ======================================== */

  const getDirections = () => {

    /*
      If geolocation is unavailable,
      Google Maps can determine the user's
      starting point itself.
    */

    if (
      !navigator.geolocation
    ) {

      openDirections();

      return;

    }


    navigator.geolocation.getCurrentPosition(

      /* SUCCESS */

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        openDirections(
          latitude,
          longitude
        );

      },


      /* ERROR / PERMISSION DENIED */

      () => {

        /*
          GPS permission is optional.

          If denied, open Maps without an
          explicit origin. Google Maps can
          request/use the location itself.
        */

        openDirections();

      },


      /* OPTIONS */

      {
        enableHighAccuracy:
          true,

        timeout:
          10000,

        maximumAge:
          60000,
      }

    );

  };


  /* ========================================
     PAGE
     ======================================== */

  return (
    <section className="direction-page">

      {/* BACKGROUND OVERLAY */}

      <div className="direction-overlay" />


      <div className="direction-container">

        {/* =================================
            HERO
            ================================= */}

        <div className="direction-hero">

          <h4>
            DIRECTIONS
          </h4>


          <h1>
            Where is{" "}
            <span>
              PolChat?
            </span>
          </h1>


          <p>
            We're easy to find! Follow the map or use
            Google Maps to get driving directions to
            PolChat Garden Resort.
          </p>

        </div>


        {/* =================================
            GOOGLE MAP
            ================================= */}

        <div className="map-card">

          <iframe
            title="PolChat Garden Resort"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.957776407717!2d121.16405689999998!3d14.601481199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b9001840a21d%3A0x34dc9d7152f44ab!2sPolChat%20Garden!5e0!3m2!1sen!2sph!4v1786198049809!5m2!1sen!2sph"
            loading="lazy"
            allowFullScreen
          />

        </div>


        {/* =================================
            DIRECTIONS BUTTON
            ================================= */}

        <div className="direction-action">

          <div className="direction-action-text">

            <span className="direction-pin">
              📍
            </span>


            <div>

              <h3>
                Ready to visit?
              </h3>


              <p>
                Use your current location to get
                driving directions to the resort.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="get-directions-button"
            onClick={
              getDirections
            }
          >

            Open in Google Maps

          </button>

        </div>


        {/* =================================
            ADDRESS
            ================================= */}

        <div className="direction-address">

          <span>
            Resort Address
          </span>


          <p>
            Blk 5 Lot 1 James Street,
            Baltao Subdivision, Taktak Road,
            Brgy. Sta. Cruz, Antipolo City,
            Rizal 1870
          </p>

        </div>


        {/* =================================
            FOOTER QUOTE
            ================================= */}

        <div className="direction-footer">



        </div>

      </div>

    </section>
  );
}