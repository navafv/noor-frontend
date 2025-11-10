import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Phone, Mail, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';

/**
 * Page for viewing all registered students.
 */
function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: currentPage,
          page_size: studentsPerPage,
          search: searchQuery,
        };
        const response = await api.get('/students/', { params });
        setStudents(response.data.results);
        setCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / studentsPerPage));
      } catch (err) {
        setError('Could not fetch students. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Manage Students" />
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Users size={28} className="mr-3 text-primary" />
          Students ({count})
        </h1>
        <Link
          to="/admin/enquiries" // Go to enquiries to add a new student
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} />
          Add Student
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 px-4">
        <input
          type="text"
          placeholder="Search students by name or reg no..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-input"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Error State */}
      {error && <p className="form-error mx-4">{error}</p>}

      {/* Empty State */}
      {!loading && !error && students.length === 0 && (
        <div className="text-center p-10 card mx-4">
          <Users size={40} className="mx-auto text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">No Students Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery ? 'Try a different search term.' : 'Convert an enquiry to a student to see them here.'}
          </p>
        </div>
      )}

      {/* Student List */}
      {!loading && !error && students.length > 0 && (
        <div className="card overflow-hidden mx-4">
          <ul role="list" className="divide-y divide-border">
            {students.map((student) => (
              <li key={student.id}>
                <Link
                  to={`/admin/student/${student.id}`}
                  className="block hover:bg-accent"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-medium text-primary">
                          {getInitials(student.user.first_name, student.user.last_name)}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-semibold text-primary">
                          {student.user.first_name} {student.user.last_name}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-muted-foreground">
                          <span className="truncate">Reg No: {student.reg_no}</span>
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <div>
                          <p className="mt-1 flex items-center text-sm text-muted-foreground">
                            <Phone size={16} className="mr-2 text-muted-foreground" />
                            {student.user.phone}
                          </p>
                          {student.user.email && (
                            <p className="mt-1 flex items-center text-sm text-muted-foreground">
                              <Mail size={16} className="mr-2 text-muted-foreground" />
                              {student.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </div>
                  </div>
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