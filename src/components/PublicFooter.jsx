import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

function PublicFooter() {
  return (
    <footer className="bg-noor-heading text-white">
      <div className="mx-auto max-w-5xl p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-2xl logo text-noor-pink">Noor Stitching Institute</h3>
            <p className="mt-2 text-gray-300">
              Short term course with a Long term Career. We offer 3-month and 6-month courses in professional stitching.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold uppercase text-gray-200">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/" className="hover:text-noor-pink transition-colors">Home</a></li>
              <li><a href="/courses" className="hover:text-noor-pink transition-colors">Courses</a></li>
              <li><a href="/about" className="hover:text-noor-pink transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-noor-pink transition-colors">Contact</a></li>
              <li><a href="/login" className="hover:text-noor-pink transition-colors">Student Login</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold uppercase text-gray-200">Contact Us</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 shrink-0 mt-1" />
                <span>Noor Stitching Institute, Madrassa Building, Kacheriparamba, Munderi</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-3 shrink-0 mt-1" />
                <a href="tel:+919526978708" className="hover:text-noor-pink transition-colors">+91 9526978708</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Noor Stitching Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;