import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Book, ChevronRight, Package } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';

/**
 * Admin page to list all courses, acting as an entry point
 * to manage materials for each course.
 */
function AdminCourseMaterialsPage() {
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
    <div className="flex h-full flex-col">
      <PageHeader title="Manage Course Materials" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-muted-foreground mb-4">
            Select a course to add, edit, or remove its materials (files, links, etc.).
          </p>

          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && courses.length === 0 && (
            <div className="text-center p-10 card">
              <Package size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Courses Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You must create a course before you can add materials to it.
              </p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {courses.map(course => (
                  <li key={course.id}>
                    <Link
                      to={`/admin/materials/${course.id}`}
                      className="block hover:bg-accent"
                    >
                      <div className="flex items-center p-4">
                        <Book size={20} className="mr-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.code}</p>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminCourseMaterialsPage;