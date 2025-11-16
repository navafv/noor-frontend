import React from 'react';
import { Link } from 'react-router-dom';

function PublicFooter() {
  return (
    <footer className="w-full bg-card border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="logo text-3xl text-primary mb-2">Noor Stitching Institute</h3>
            <p className="text-muted-foreground text-sm">
              Empowering creativity and skill through the art of stitching.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Kacheriparamba,</li>
              <li>PO Munderi, Kannur</li>
              <li>Phone: +91 9526978708</li>
              <li>Email: info@noorinstitute.com</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Noor Stitching Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;