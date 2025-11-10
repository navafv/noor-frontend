import React from 'react';
import { Link } from 'react-router-dom';
import EnquiryForm from '../components/EnquiryForm.jsx';
import { CheckCircle, Scissors, Users } from 'lucide-react';

function HomePage() {
  return (
    <div className="bg-background">
      {/* 1. Hero Section */}
      <section 
        className="relative h-[60vh] min-h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('/stitching_inauguration.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-5xl md:text-7xl font-bold logo text-secondary-400">
            Noor Stitching Institute
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light">
            Short term course with a Long term Career.
          </p>
          <Link to="/contact" className="btn-primary mt-8 px-8 py-3 text-lg">
            Enroll Now
          </Link>
        </div>
      </section>

      {/* 2. Features/About Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard
            icon={Scissors}
            title="Expert Trainers"
            description="Learn from experienced professionals with years of industry knowledge."
          />
          <FeatureCard
            icon={Users}
            title="Small Batch Sizes"
            description="Get personalized attention and guidance in our small, focused classes."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Career Focused"
            description="Our curriculum is designed to give you the practical skills you need to succeed."
          />
        </div>
      </section>

      {/* 3. Courses Offered Section */}
      <section className="py-20 bg-card dark:bg-background">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Courses</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            We offer flexible courses to fit your schedule.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CourseCard
              title="3 Month Course"
              description="An intensive program covering all the fundamentals of stitching and garment making. Perfect for beginners."
              imgSrc="/stitching_promo.jpg"
            />
            <CourseCard
              title="6 Month Course"
              description="A comprehensive, in-depth course for advanced techniques, design, and specialization. Become a master."
              imgSrc="/stitching_inauguration.jpg"
            />
          </div>
          <Link to="/courses" className="btn-secondary mt-12 px-6 py-3">
            Learn More About Courses
          </Link>
        </div>
      </section>
      
      {/* 4. Enquiry Form Section */}
      <section id="register" className="py-20 bg-background">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Register Your Interest
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Fill out the form below for admission details and we'll contact you.
            </p>
          </div>
          <div className="mt-10 p-8 card">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon size={32} />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

const CourseCard = ({ title, description, imgSrc }) => (
  <div className="flex flex-col overflow-hidden rounded-xl card text-left">
    <img src={imgSrc} alt={title} className="h-64 w-full object-cover" />
    <div className="p-6 bg-card flex-1">
      <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default HomePage;