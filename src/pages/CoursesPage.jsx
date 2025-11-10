import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Loader2, Clock, DollarSign, CheckCircle } from 'lucide-react';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses/');
        setCourses(res.data.results || []);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-4xl font-bold text-noor-heading text-center">Our Courses</h1>
        <p className="text-xl text-gray-600 text-center mt-2">
          Find the perfect course to start your career.
        </p>

        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="animate-spin text-noor-pink" size={40} />
          </div>
        )}
        {error && <p className="form-error text-center mt-10">{error}</p>}

        {!loading && !error && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.length > 0 ? courses.map(course => (
              <CourseCard key={course.id} course={course} />
            )) : (
              <p className="text-center text-gray-500 md:col-span-2">No courses are available right now. Please check back later.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
    <div className="p-8">
      <h2 className="text-2xl font-bold text-noor-heading">{course.title}</h2>
      <p className="text-gray-600 mt-2">{course.syllabus || 'Learn the fundamentals and advanced techniques of professional stitching.'}</p>
      
      <div className="mt-6 space-y-3">
        <InfoRow icon={DollarSign} text={`Fees: ₹${parseFloat(course.total_fees).toLocaleString('en-IN')}`} />
        <InfoRow icon={Clock} text={`Duration: ${course.duration_weeks} Weeks`} />
        <InfoRow icon={CheckCircle} text={course.active ? "Admissions Open" : "Admissions Closed"} />
      </div>
    </div>
    <div className="mt-auto bg-gray-50 p-6">
      <Link to="/contact" className="btn-primary w-full justify-center">
        Enquire Now
      </Link>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 text-noor-pink" />
    <span className="ml-3 text-gray-700">{text}</span>
  </div>
);

export default CoursesPage;