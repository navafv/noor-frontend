import React from 'react';
import EnquiryForm from '../components/EnquiryForm';
import { Phone, Mail, MapPin } from 'lucide-react';

function ContactPage() {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-noor-heading">Get In Touch</h1>
          <p className="text-xl text-gray-600 mt-2">
            We'd love to hear from you. Start your journey today!
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Column 1: Contact Info */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-noor-heading mb-6">Contact Information</h2>
            <div className="space-y-6">
              <InfoRow
                icon={MapPin}
                title="Address"
                lines={[
                  "Noor Stitching Institute,",
                  "Madrassa Building, Kacheriparamba,",
                  "Munderi, 670591"
                ]}
              />
              <InfoRow
                icon={Phone}
                title="Phone"
                lines={[
                  <a href="tel:+919526978708" className="hover:text-noor-pink">+91 9526978708</a>
                ]}
              />
              <InfoRow
                icon={Mail}
                title="Email"
                lines={[
                  <a href="mailto:info@noorstitching.com" className="hover:text-noor-pink">info@noorstitching.com</a>,
                  <span className="text-sm">(For enquiries)</span>
                ]}
              />
            </div>
          </div>

          {/* Column 2: Enquiry Form */}
          <div className="p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-semibold text-noor-heading mb-6">Send us a Message</h2>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ icon: Icon, title, lines }) => (
  <div className="flex">
    <Icon className="w-6 h-6 text-noor-pink shrink-0 mt-1" />
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-noor-heading">{title}</h3>
      {lines.map((line, index) => (
        <p key={index} className="text-gray-700">{line}</p>
      ))}
    </div>
  </div>
);

export default ContactPage;