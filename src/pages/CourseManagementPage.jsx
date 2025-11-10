import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Book, Box, User } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';

// Main page component
function CourseManagementPage() {
  const [activeTab, setActiveTab] = useState('courses');
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Link to="/admin/dashboard" className="flex items-center gap-1 text-noor-pink">
            <ChevronLeft size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-16 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl px-4">
          <TabButton icon={Book} label="Courses" isActive={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <TabButton icon={Box} label="Batches" isActive={activeTab === 'batches'} onClick={() => setActiveTab('batches')} />
          <TabButton icon={User} label="Trainers" isActive={activeTab === 'trainers'} onClick={() => setActiveTab('trainers')} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
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
      ${isActive ? 'border-noor-pink text-noor-pink' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description.substring(0, 100)}...</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>Fees: <strong>₹{item.fees}</strong></span>
            <span>Duration: <strong>{item.duration} days</strong></span>
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
          <p className="text-sm text-gray-500">Trainer: {item.trainer_name}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span>Timing: <strong>{item.timing}</strong></span>
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
        api.get('/users/?is_staff=true')
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
          <p className="font-semibold">{item.user_name}</p>
          <p className="text-sm text-gray-500">{item.specialization}</p>
        </li>
      )}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Trainer">
        <TrainerForm staffUsers={staffUsers} onSaved={() => { fetchItems(); setIsModalOpen(false); }} />
      </Modal>
    </CrudList>
  );
}

// --- Reusable Components for this page ---

// Reusable list wrapper
const CrudList = ({ title, items, loading, onAdd, renderItem, children }) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-noor-heading">{title}</h2>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus size={18} /> New {title}
      </button>
    </div>
    {loading ? (
      <div className="flex justify-center items-center min-h-[200px]"><Loader2 className="animate-spin text-noor-pink" /></div>
    ) : (
      <div className="bg-white rounded-xl shadow-sm">
        <ul className="divide-y divide-gray-200">
          {items.length === 0 ? <p className="p-10 text-center text-gray-500">No {title.toLowerCase()} found.</p> : items.map(renderItem)}
        </ul>
      </div>
    )}
    {children}
  </>
);

// Form for creating a Course
function CourseForm({ onSaved }) {
  const [data, setData] = useState({ title: '', description: '', duration: 30, fees: 0 });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/courses/', data);
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Title</label><input type="text" name="title" value={data.title} onChange={handleChange} className="form-input" required /></div>
      <div><label className="form-label">Description</label><textarea name="description" value={data.description} onChange={handleChange} className="form-input" rows="3"></textarea></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Duration (days)</label><input type="number" name="duration" value={data.duration} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">Fees (₹)</label><input type="number" name="fees" value={data.fees} onChange={handleChange} className="form-input" required /></div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Course'}</button>
    </form>
  );
}

// Form for creating a Batch
function BatchForm({ courses, trainers, onSaved }) {
  const [data, setData] = useState({ course: '', trainer: '', code: '', start_date: '', end_date: '', timing: '' });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/batches/', data);
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">Course</label><select name="course" value={data.course} onChange={handleChange} className="form-input" required><option value="" disabled>Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
      <div><label className="form-label">Trainer</label><select name="trainer" value={data.trainer} onChange={handleChange} className="form-input" required><option value="" disabled>Select trainer</option>{trainers.map(t => <option key={t.id} value={t.id}>{t.user_name}</option>)}</select></div>
      <div><label className="form-label">Batch Code</label><input type="text" name="code" value={data.code} onChange={handleChange} className="form-input" required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Start Date</label><input type="date" name="start_date" value={data.start_date} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">End Date</label><input type="date" name="end_date" value={data.end_date} onChange={handleChange} className="form-input" required /></div>
      </div>
      <div><label className="form-label">Timing</label><input type="text" name="timing" value={data.timing} onChange={handleChange} className="form-input" placeholder="e.g., 10:00 AM - 12:00 PM" /></div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Batch'}</button>
    </form>
  );
}

// Form for creating a Trainer
function TrainerForm({ staffUsers, onSaved }) {
  const [data, setData] = useState({ user: '', specialization: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/trainers/', data);
    setLoading(false);
    onSaved();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="form-label">User Account</label><select name="user" value={data.user} onChange={handleChange} className="form-input" required><option value="" disabled>Select staff member</option>{staffUsers.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.username})</option>)}</select></div>
      <div><label className="form-label">Specialization</label><input type="text" name="specialization" value={data.specialization} onChange={handleChange} className="form-input" /></div>
      <div><label className="form-label">Bio</label><textarea name="bio" value={data.bio} onChange={handleChange} className="form-input" rows="3"></textarea></div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Trainer'}</button>
    </form>
  );
}

export default CourseManagementPage;