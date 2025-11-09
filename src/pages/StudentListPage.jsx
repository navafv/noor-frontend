import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '@/services/api.js'; // <-- UPDATED
import BackButton from '@/components/BackButton.jsx';

/**
 * Page for viewing all registered students.
 */
function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        // This GET request is authenticated and only works for staff
        const response = await api.get('/students/');
        setStudents(response.data.results); // 'results' from DRF pagination
      } catch (err) {
        setError('Could not fetch students. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // The empty array [] means this runs once

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <BackButton />
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-noor-heading flex items-center">
          <Users size={28} className="mr-3 text-noor-primary" />
          Manage Students
        </h1>
        <Link
          to="/admin/enquiries"
          className="btn-secondary"
        >
          <UserPlus size={18} className="mr-2" />
          Add Student
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-gray-500">Loading students...</p>
        </div>
      )}

      {/* Error State */}
      {error && <p className="form-error">{error}</p>}

      {/* Empty State */}
      {!loading && !error && students.length === 0 && (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
          <Users size={40} className="mx-auto text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-700">No Students Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Convert an enquiry to a student to see them here.
          </p>
        </div>
      )}

      {/* Student List */}
      {!loading && !error && students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id}>
                {/* 1. Wrap this in a Link component */}
                <Link
                  to={`/admin/student/${student.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-noor-primary/10">
                        <span className="font-medium text-noor-primary">
                          {getInitials(student.user.first_name, student.user.last_name)}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-semibold text-noor-primary">
                          {student.user.first_name} {student.user.last_name}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="truncate">Reg No: {student.reg_no}</span>
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <div>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            {student.user.phone}
                          </p>
                          {student.user.email && (
                            <p className="mt-1 flex items-center text-sm text-gray-500">
                              <Mail size={16} className="mr-2 text-gray-400" />
                              {student.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                {/* 2. Close the Link component */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentListPage;