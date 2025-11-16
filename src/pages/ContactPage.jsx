import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

function ContactPage() {
  return (
    <div className="bg-background min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We'd love to hear from you. Please reach out with any questions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactCard 
            icon={Phone} 
            title="Phone" 
            content="+91 9526978708" 
          />
          <ContactCard 
            icon={Mail} 
            title="Email" 
            content="info@noorinstitute.com" 
          />
          <ContactCard 
            icon={MapPin} 
            title="Address" 
            content="Munderi, Malappuram, Kerala, India" 
          />
        </div>
        
        {/* You could add a Google Maps embed here */}
      </div>
    </div>
  );
}

const ContactCard = ({ icon: Icon, title, content }) => (
  <div className="card p-8 text-center">
    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{content}</p>
  </div>
);

export default ContactPage;