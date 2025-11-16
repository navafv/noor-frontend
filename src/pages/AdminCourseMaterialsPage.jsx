import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Book, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminCourseMaterialsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/courses/');
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
    <>
      <PageHeader title="Course Materials" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-muted-foreground mb-6">
            Select a course to view, add, or remove its materials.
          </p>
          
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : courses.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No courses found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {courses.map((course) => (
                  <li 
                    key={course.id}
                    onClick={() => navigate(`/admin/materials/${course.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Book size={20} className="text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.code}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminCourseMaterialsPage;