import React from 'react';
import { Sparkles, Target, Users } from 'lucide-react';

function AboutPage() {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-noor-heading">About Noor Stitching Institute</h1>
          <p className="text-xl text-gray-600 mt-2">
            Empowering women through creative skills.
          </p>
        </div>

        {/* Content & Image */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-noor-heading">Our Story</h2>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Founded on the belief that skill and creativity can unlock economic independence, Noor Stitching Institute is dedicated to providing professional-grade training for women.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              Our institute, located in Munderi, provides a supportive and modern learning environment. We believe in "Short term course with a Long term Career," offering intensive 3-month and 6-month programs designed to take you from beginner to expert.
            </p>
            <p className="text-gray-700 mt-4 leading-relaxed">
              We are proud to be a part of the Kacheriparamba Varna Mujawayude community initiative.
            </p>
          </div>
          <div>
            <img 
              src="/stitching_inauguration.jpg" 
              alt="Noor Stitching Institute Inauguration"
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoBox
            icon={Target}
            title="Our Mission"
            description="To provide high-quality, accessible, and career-focused stitching and tailoring education, empowering our students to achieve financial independence and artistic fulfillment."
          />
          <InfoBox
            icon={Sparkles}
            title="Our Vision"
            description="To be a leading center for creative skill development, recognized for our expert faculty, supportive community, and the success of our graduates in the fashion industry."
          />
        </div>
      </div>
    </div>
  );
}

const InfoBox = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
    <Icon className="w-12 h-12 text-noor-pink" />
    <h3 className="text-2xl font-semibold text-noor-heading mt-4">{title}</h3>
    <p className="text-gray-700 mt-2">{description}</p>
  </div>
);

export default AboutPage;