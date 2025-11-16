import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, Search, User, ChevronRight } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActive, setFilterActive] = useState('true'); // 'true', 'false', ''
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page,
          active: filterActive,
          search: searchTerm,
        });

        const res = await api.get(`/students/?${params.toString()}`);
        setStudents(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / 20)); // Assuming page size is 20
      } catch (err) {
        console.error("Failed to fetch students:", err);
        toast.error('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchStudents();
    }, 500); // Wait 500ms after user stops typing
    
    return () => clearTimeout(timer);
    
  }, [page, filterActive, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  const handleFilterChange = (e) => {
    setFilterActive(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  return (
    <>
      <PageHeader title="Students">
        {/* "Add Student" button is handled by converting an enquiry */}
      </PageHeader>
      
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search by name, reg no, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <select
                value={filterActive}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="true">Active Students</option>
                <option value="false">Inactive Students</option>
                <option value="">All Students</option>
              </select>
            </div>
          </div>

          {/* Student List */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">
                <User size={48} className="mx-auto mb-4" />
                <p>No students found.</p>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {students.map((student) => (
                  <li 
                    key={student.id}
                    onClick={() => navigate(`/admin/student/${student.id}`)}
                    className="block hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center p-4 sm:px-6">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-primary">
                          {student.user.first_name} {student.user.last_name}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-muted-foreground">
                          {student.reg_no}
                        </p>
                      </div>
                      <div className="ml-4 shrink-0 flex flex-col items-end gap-1">
                        <span className={`status-badge ${student.active ? 'status-completed' : 'status-closed'}`}>
                          {student.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Joined: {formatDate(student.admission_date)}
                        </span>
                      </div>
                      <div className="ml-4 shrink-0">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline btn-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-outline btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default StudentListPage;