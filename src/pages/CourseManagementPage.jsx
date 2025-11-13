/* UPDATED FILE: navafv/noor-frontend/noor-frontend-c23097d14777e9c489af86e2822e1a66601485e8/src/pages/CourseManagementPage.jsx */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Book, Box, User, MessageSquare, Star } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import PageHeader from '@/components/PageHeader.jsx';

// ... (Main component and TabButton are unchanged) ...
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
          <TabButton icon={MessageSquare} label="Feedback" isActive={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {activeTab === 'courses' && <CourseTab />}
          {activeTab === 'batches' && <BatchTab />}
          {activeTab === 'trainers' && <TrainerTab />}
          {activeTab === 'feedback' && <FeedbackTab />}
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


// --- UPDATE CourseTab ---
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
            {/* --- ADDED REQUIRED DAYS --- */}
            <span>Attendance Goal: <strong>{item.required_attendance_days} days</strong></span>
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

// --- UPDATE BatchTab ---
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
      title="Batches (Groups)" // <-- Renamed title
      items={items}
      loading={loading}
      onAdd={() => setIsModalOpen(true)}
      renderItem={item => (
        <li key={item.id} className="p-4">
          <p className="font-semibold">Batch {item.code} ({item.course_title})</p>
          <p className="text-sm text-muted-foreground">Trainer: {item.trainer_name || 'Not assigned'}</p>
          <div className="flex gap-4 text-sm mt-2">
            {/* --- SIMPLIFIED BATCH INFO --- */}
            <span>Capacity: <strong>{item.capacity || 'Not set'}</strong></span>
          </div>
        </li>
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Batch (Group)">
        <BatchForm courses={courses} trainers={trainers} onSaved={() => { fetchItems(); setIsModalOpen(false); }} />
      </Modal>
    </CrudList>
  );
}

// ... (TrainerTab component is unchanged) ...
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

// ... (FeedbackTab component is unchanged) ...
function FeedbackTab() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback/');
      setFeedback(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchFeedback(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Student Feedback</h2>
      {feedback.length === 0 ? (
        <p className="card p-10 text-center text-muted-foreground">No feedback has been submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {feedback.map(item => (
            <div key={item.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">{item.student_name}</p>
                  <p className="text-sm text-muted-foreground">Batch: {item.batch_code}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={20} fill="currentColor" />
                  <span className="text-xl font-bold">{item.rating}</span>
                </div>
              </div>
              {item.comments && (
                <p className="text-muted-foreground mt-3 pt-3 border-t border-border italic">
                  "{item.comments}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ... (CrudList component is unchanged) ...
const CrudList = ({ title, items, loading, onAdd, renderItem, children }) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {onAdd && ( // Only show button if 'onAdd' prop is passed
        <button onClick={onAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New {title.slice(0, -1)}
        </button>
      )}
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


// --- UPDATE CourseForm ---
function CourseForm({ onSaved }) {
  const [data, setData] = useState({ 
    code: '', 
    title: '', 
    duration_weeks: 12, 
    total_fees: 0, 
    syllabus: '',
    required_attendance_days: 36 // <-- 1. ADD NEW FIELD
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // --- 2. ADD LOGIC TO AUTO-UPDATE DAYS ---
    let newData = { ...data, [name]: value };
    if (name === 'duration_weeks') {
      const weeks = parseInt(value, 10);
      if (weeks === 12) {
        newData.required_attendance_days = 36;
      } else if (weeks === 24) {
        newData.required_attendance_days = 72;
      } else if (!isNaN(weeks)) {
        newData.required_attendance_days = weeks * 3; // Default to 3 days/week
      }
    }
    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/courses/', data); 
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Course Title</label><input type="text" name="title" value={data.title} onChange={handleChange} className="form-input" required /></div>
      <div><label className="form-label">Course Code</label><input type="text" name="code" value={data.code} onChange={handleChange} className="form-input" required placeholder="e.g., 3MC or 6MC" /></div>
      <div><label className="form-label">Syllabus / Description</label><textarea name="syllabus" value={data.syllabus} onChange={handleChange} className="form-input" rows="3"></textarea></div>
      <div className="grid grid-cols-3 gap-4"> {/* <-- 3. CHANGED TO 3 COLS */}
        <div><label className="form-label">Duration (weeks)</label><input type="number" name="duration_weeks" value={data.duration_weeks} onChange={handleChange} className="form-input" required /></div>
        {/* --- 4. ADDED NEW INPUT --- */}
        <div><label className="form-label">Required Days</label><input type="number" name="required_attendance_days" value={data.required_attendance_days} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">Total Fees (₹)</label><input type="number" name="total_fees" value={data.total_fees} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Course'}</button>
    </form>
  );
}


// --- UPDATE BatchForm ---
function BatchForm({ courses, trainers, onSaved }) {
  const [data, setData] = useState({ 
    course: '', 
    trainer: '', 
    code: '', 
    // timing: '', // <-- 1. REMOVED TIMING
    capacity: 10 
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // --- 2. SIMPLIFIED PAYLOAD ---
    const dataToSend = {
      course: data.course,
      trainer: data.trainer || null,
      code: data.code,
      capacity: data.capacity,
      schedule: {} // Send empty schedule
    };
    
    await api.post('/batches/', dataToSend);
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Course</label><select name="course" value={data.course} onChange={handleChange} className="form-input" required><option value="" disabled>Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
      <div><label className="form-label">Trainer</label><select name="trainer" value={data.trainer} onChange={handleChange} className="form-input"><option value="">Select trainer (optional)</option>{trainers.map(t => <option key={t.id} value={t.id}>{t.trainer_name}</option>)}</select></div>
      {/* --- 3. MOVED TO 2-COL GRID --- */}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Batch Code / Group Name</label><input type="text" name="code" value={data.code} onChange={handleChange} className="form-input" required placeholder="e.g., Group-A" /></div>
        <div><label className="form-label">Capacity</label><input type="number" name="capacity" value={data.capacity} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Batch'}</button>
    </form>
  );
}

// ... (TrainerForm component is unchanged) ...
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