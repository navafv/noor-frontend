/*
 * UPDATED FILE: src/pages/TeacherBatches.jsx
 *
 * FIX: Replaced alias imports (@/) with relative imports (../)
 * to resolve the build/compilation error.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Book, Users, ChevronRight, User } from 'lucide-react';
import api from '../services/api.js'; // <-- FIX: Relative path
import PageHeader from '../components/PageHeader.jsx'; // <-- FIX: Relative path
import Modal from '../components/Modal.jsx'; // <-- FIX: Relative path

function TeacherBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchMyBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use the new teacher-specific endpoint
        const res = await api.get('/teacher/my-batches/');
        setBatches(res.data || []);
      } catch (err) {
        setError('Could not load your batches.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBatches();
  }, []);

  const handleViewStudents = async (batch) => {
    try {
      setLoadingStudents(true);
      setIsModalOpen(true);
      setSelectedBatch(batch);
      const res = await api.get(`/teacher/my-batches/${batch.id}/students/`);
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <>
      <PageHeader title="My Batches" />
      
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          
          {!loading && !error && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {batches.length === 0 ? (
                  <p className="p-10 text-center text-muted-foreground">You are not assigned to any batches.</p>
                ) : (
                  batches.map((batch) => (
                    <li key={batch.id} className="block hover:bg-accent">
                      <div className="flex items-center p-4 sm:px-6">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">
                            {batch.code}
                          </p>
                          <p className="mt-1 flex items-center text-sm text-muted-foreground">
                            <Book size={16} className="mr-2" />
                            {batch.course_title}
                          </p>
                        </div>
                        <div className="ml-4 shrink-0">
                          <button
                            onClick={() => handleViewStudents(batch)}
                            className="btn-secondary"
                          >
                            <Users size={18} className="mr-2" />
                            View Students
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* View Students Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Students in ${selectedBatch?.code}`}
      >
        {loadingStudents ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <ul className="divide-y divide-border -mx-6">
            {students.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No active students found in this batch.</p>
            ) : (
              students.map(student => (
                <li key={student.id} className="flex items-center p-4">
                  <User size={18} className="mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student.user.first_name} {student.user.last_name}</p>
                    <p className="text-sm text-muted-foreground">{student.reg_no}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </li>
              ))
            )}
          </ul>
        )}
      </Modal>
    </>
  );
}

export default TeacherBatches;