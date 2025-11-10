import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function PublicFooter() {
  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="mx-auto max-w-5xl p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-2xl logo text-primary">Noor Stitching Institute</h3>
            <p className="mt-2 text-muted-foreground">
              Short term course with a Long term Career. We offer 3-month and 6-month courses in professional stitching.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold uppercase text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/home" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold uppercase text-foreground">Contact Us</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 shrink-0 mt-1 text-primary" />
                <span className="text-muted-foreground">Noor Stitching Institute, Madrassa Building, Kacheriparamba, Munderi</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-3 shrink-0 mt-1 text-primary" />
                <a href="tel:+919526978708" className="text-muted-foreground hover:text-primary transition-colors">+91 9526978708</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Noor Stitching Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;