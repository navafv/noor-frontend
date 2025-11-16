import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Clock, DollarSign, Book } from 'lucide-react';
import { toast } from 'react-hot-toast';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch only active courses for the public
        const res = await api.get('/courses/', { params: { active: true } });
        setCourses(res.data.results || []);
      } catch (err) {
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-background min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Courses
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect program to start your creative journey.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground">No courses are available at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="card flex flex-col justify-between p-6">
                <div>
                  <Book className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
                  <p className="text-muted-foreground mt-2">{course.syllabus || 'Learn the fundamentals and advanced techniques.'}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <Clock size={16} className="text-primary" />
                    <strong>Duration:</strong> {course.duration_weeks} weeks
                  </p>
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <DollarSign size={16} className="text-primary" />
                    <strong>Fees:</strong> ₹{Number(course.total_fees).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;