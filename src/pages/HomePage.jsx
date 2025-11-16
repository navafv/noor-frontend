import React from 'react';
import EnquiryForm from '../components/EnquiryForm.jsx';
import { Check } from 'lucide-react';

function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Column 1: Text Content */}
            <div className="max-w-xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                Welcome to Noor
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Learn the Art of Stitching & Design
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We offer professional courses in tailoring, embroidery, and fashion design to turn your passion into a profession.
              </p>
              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Expert-led training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Hands-on practical experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Government-approved certification</span>
                </li>
              </ul>
            </div>
            
            {/* Column 2: Enquiry Form */}
            <div className="lg:pl-8">
              <EnquiryForm />
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide a complete learning experience for all skill levels.
            </p>
          </div>
          {/* You can add more feature cards or an image gallery here */}
        </div>
      </section>
    </div>
  );
}

export default HomePage;