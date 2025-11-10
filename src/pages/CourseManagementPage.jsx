/*
 * UPDATED FILE: src/pages/CourseManagementPage.jsx
 *
 * FIX: The CourseForm and BatchForm sub-components now send the
 * correct field names and data structures to match the backend API.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Book, Box, User } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import PageHeader from '@/components/PageHeader.jsx'; // Import PageHeader

// Main page component
function CourseManagementPage() {
  const [activeTab, setActiveTab] = useState('courses');
  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="Course Management" />

      {/* Tab Navigation */}
      <nav className="sticky top-16 z-10 bg-card border-b border-border">
        <div className="mx-auto flex max-w-4xl px-4">
          <TabButton icon={Book} label="Courses" isActive={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <TabButton icon={Box} label="Batches" isActive={activeTab === 'batches'} onClick={() => setActiveTab('batches')} />
          <TabButton icon={User} label="Trainers" isActive={activeTab === 'trainers'} onClick={() => setActiveTab('trainers')} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {activeTab === 'courses' && <CourseTab />}
          {activeTab === 'batches' && <BatchTab />}
          {activeTab === 'trainers' && <TrainerTab />}
        </div>
      </main>
    </div>
  );
}

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 p-4 border-b-2 font-medium transition-colors
      ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
  >
    <Icon size={18} />
    {label}
  </button>
);

// --- Course Tab ---
function CourseTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const res = await api.get('/courses/');
    setItems(res.data.results || []);
    setLoading(false);
  };
  
  useEffect(() => { fetchItems(); }, []);

  return (
    <CrudList
      title="Courses"
      items={items}
      loading={loading}
      onAdd={() => setIsModalOpen(true)}
      renderItem={item => (
        <li key={item.id} className="p-4">
          <p className="font-semibold">{item.title} ({item.code})</p>
          <p className="text-sm text-muted-foreground">{item.syllabus?.substring(0, 100) || 'No syllabus'}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>Fees: <strong>₹{parseFloat(item.total_fees).toLocaleString('en-IN')}</strong></span>
            <span>Duration: <strong>{item.duration_weeks} weeks</strong></span>
          </div>
        </li>
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
        <CourseForm onSaved={() => { fetchItems(); setIsModalOpen(false); }} />
      </Modal>
    </CrudList>
  );
}

// --- Batch Tab ---
function BatchTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data for modal dropdowns
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    const [batchRes, courseRes, trainerRes] = await Promise.all([
      api.get('/batches/'),
      api.get('/courses/'),
      api.get('/trainers/')
    ]);
    setItems(batchRes.data.results || []);
    setCourses(courseRes.data.results || []);
    setTrainers(trainerRes.data.results || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <CrudList
      title="Batches"
      items={items}
      loading={loading}
      onAdd={() => setIsModalOpen(true)}
      renderItem={item => (
        <li key={item.id} className="p-4">
          <p className="font-semibold">Batch {item.code} ({item.course_title})</p>
          <p className="text-sm text-muted-foreground">Trainer: {item.trainer_name || 'Not assigned'}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>Schedule: <strong>{item.schedule?.timing || 'Not set'}</strong></span>
            <span>Starts: <strong>{new Date(item.start_date).toLocaleDateString()}</strong></span>
          </div>
        </li>
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Batch">
        <BatchForm courses={courses} trainers={trainers} onSaved={() => { fetchItems(); setIsModalOpen(false); }} />
      </Modal>
    </CrudList>
  );
}

// --- Trainer Tab ---
function TrainerTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffUsers, setStaffUsers] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    const [trainerRes, userRes] = await Promise.all([
        api.get('/trainers/'),
        api.get('/users/?is_staff=true') // Fetch users who can be trainers
    ]);
    setItems(trainerRes.data.results || []);
    setStaffUsers(userRes.data.results || []);
    setLoading(false);
  };
  
  useEffect(() => { fetchItems(); }, []);

  return (
    <CrudList
      title="Trainers"
      items={items}
      loading={loading}
      onAdd={() => setIsModalOpen(true)}
      renderItem={item => (
        <li key={item.id} className="p-4">
          <p className="font-semibold">{item.trainer_name} ({item.emp_no})</p>
          <p className="text-sm text-muted-foreground">Joined: {new Date(item.join_date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground">Salary: ₹{parseFloat(item.salary).toLocaleString('en-IN')}</p>
        </li>
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Trainer">
        <TrainerForm 
          staffUsers={staffUsers} 
          existingTrainers={items}
          onSaved={() => { fetchItems(); setIsModalOpen(false); }} 
        />
      </Modal>
    </CrudList>
  );
}

// --- Reusable Components for this page ---

// Reusable list wrapper
const CrudList = ({ title, items, loading, onAdd, renderItem, children }) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus size={18} /> New {title.slice(0, -1)}
      </button>
    </div>
    {loading ? (
      <div className="flex justify-center items-center min-h-[200px]"><Loader2 className="animate-spin text-primary" /></div>
    ) : (
      <div className="card">
        <ul className="divide-y divide-border">
          {items.length === 0 ? <p className="p-10 text-center text-muted-foreground">No {title.toLowerCase()} found.</p> : items.map(renderItem)}
        </ul>
      </div>
    )}
    {children}
  </>
);

// --- FIXED CourseForm ---
function CourseForm({ onSaved }) {
  // FIX: Match backend model fields
  const [data, setData] = useState({ 
    code: '', 
    title: '', 
    duration_weeks: 12, // <-- FIX: Renamed from 'duration'
    total_fees: 0, // <-- FIX: Renamed from 'fees'
    syllabus: '' 
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/courses/', data); // This POSTs the 'data' object
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Course Title</label><input type="text" name="title" value={data.title} onChange={handleChange} className="form-input" required /></div>
      <div><label className="form-label">Course Code</label><input type="text" name="code" value={data.code} onChange={handleChange} className="form-input" required placeholder="e.g., 3MC or 6MC" /></div>
      <div><label className="form-label">Syllabus / Description</label><textarea name="syllabus" value={data.syllabus} onChange={handleChange} className="form-input" rows="3"></textarea></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Duration (weeks)</label><input type="number" name="duration_weeks" value={data.duration_weeks} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">Total Fees (₹)</label><input type="number" name="total_fees" value={data.total_fees} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Course'}</button>
    </form>
  );
}

// --- FIXED BatchForm ---
function BatchForm({ courses, trainers, onSaved }) {
  // FIX: Add 'capacity', rename 'timing'
  const [data, setData] = useState({ 
    course: '', 
    trainer: '', 
    code: '', 
    start_date: '', 
    end_date: '', 
    timing: '', // This will be nested into 'schedule'
    capacity: 10 
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // FIX: Send 'schedule' as JSON, remove 'timing'
    const dataToSend = {
      course: data.course,
      trainer: data.trainer || null,
      code: data.code,
      start_date: data.start_date,
      end_date: data.end_date,
      capacity: data.capacity,
      schedule: { timing: data.timing } // Nest timing inside schedule
    };
    
    await api.post('/batches/', dataToSend);
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Course</label><select name="course" value={data.course} onChange={handleChange} className="form-input" required><option value="" disabled>Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
      <div><label className="form-label">Trainer</label><select name="trainer" value={data.trainer} onChange={handleChange} className="form-input"><option value="">Select trainer (optional)</option>{trainers.map(t => <option key={t.id} value={t.id}>{t.trainer_name}</option>)}</select></div>
      <div><label className="form-label">Batch Code</label><input type="text" name="code" value={data.code} onChange={handleChange} className="form-input" required placeholder="e.g., 3MC-NOV25" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Start Date</label><input type="date" name="start_date" value={data.start_date} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">End Date</label><input type="date" name="end_date" value={data.end_date} onChange={handleChange} className="form-input" required /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Schedule/Timing</label><input type="text" name="timing" value={data.timing} onChange={handleChange} className="form-input" placeholder="e.g., 10AM - 1PM" /></div>
        <div><label className="form-label">Capacity</label><input type="number" name="capacity" value={data.capacity} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Batch'}</button>
    </form>
  );
}

// --- TrainerForm (This one was already correct) ---
function TrainerForm({ staffUsers, existingTrainers, onSaved }) {
  const [data, setData] = useState({ 
    user: '', 
    emp_no: '', 
    join_date: new Date().toISOString().split('T')[0], // Default to today
    salary: 0 
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/trainers/', data);
    setLoading(false);
    onSaved();
  };

  // Filter out staff users who are already trainers
  const existingTrainerUserIds = existingTrainers.map(t => t.user);
  const availableStaff = staffUsers.filter(u => !existingTrainerUserIds.includes(u.id));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">User Account</label>
        <select name="user" value={data.user} onChange={handleChange} className="form-input" required>
          <option value="" disabled>Select staff member</option>
          {availableStaff.length === 0 && <option disabled>No available staff accounts. Create a new staff user first.</option>}
          {availableStaff.map(u => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.username})
            </option>
          ))}
        </select>
      </div>
      <div><label className="form-label">Employee No.</label><input type="text" name="emp_no" value={data.emp_no} onChange={handleChange} className="form-input" required placeholder="e.g., T-001" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Joining Date</label><input type="date" name="join_date" value={data.join_date} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">Salary (₹)</label><input type="number" name="salary" value={data.salary} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Trainer'}</button>
    </form>
  );
}

export default CourseManagementPage;