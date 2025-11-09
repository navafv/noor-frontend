import React from 'react';
import EnquiryForm from '../components/EnquiryForm';

function HomePage() {
  return (
    <div className="p-4">
      {/* Hero Section */}
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-noor-heading">
          Welcome to Noor Stitching Institute
        </h1>
        <p className="mt-2 text-lg text-noor-pink">
          Short term course with a Long term Career.
        </p>
      </div>

      {/* Poster Images */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <img
          src="/stitching_inauguration.jpg"
          alt="Inauguration Poster"
          className="w-full rounded-lg shadow-md"
        />
        <img
          src="/stitching_promo.jpg"
          alt="Institute Promo Poster"
          className="w-full rounded-lg shadow-md"
        />
      </div>

      {/* Enquiry Section */}
      <div id="register" className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-noor-heading">
            Register Your Interest
          </h2>
          <p className="mt-2 text-gray-600">
            Fill out the form below for admission details.
            <br />
            We offer 3 Month & 6 Month Courses.
          </p>
        </div>
        <EnquiryForm />
      </div>

      {/* Contact Info Card */}
      <div className="mt-6 rounded-lg bg-noor-heading p-6 text-center text-white shadow-sm">
        <h3 className="text-xl font-bold">Contact Us</h3>
        <p className="mt-2">For more details & Admission:</p>
        <a href="tel:+919526978708" className="mt-1 block text-2xl font-bold">
          +91 9526978708
        </a>
        <p className="mt-2 text-sm text-gray-300">
          Noor Stitching Institute, Madrassa Building, Kacheriparamba, Munderi
        </p>
      </div>
    </div>
  );
}

export default HomePage;