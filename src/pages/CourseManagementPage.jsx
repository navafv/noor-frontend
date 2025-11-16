import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Edit, Book, Briefcase, UserCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// --- Reusable Form Input ---
const FormInput = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="form-label">{label}</label>
    <input id={name} name={name} className="form-input" {...props} />
  </div>
);

// --- Course Modal (Add/Edit) ---
const CourseModal = ({ isOpen, onClose, onSuccess, item }) => {
  const [formData, setFormData] = useState({
    code: '', title: '', duration_weeks: '', total_fees: '', syllabus: '', required_attendance_days: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (item) setFormData(item);
    else setFormData({ code: '', title: '', duration_weeks: '', total_fees: '', syllabus: '', required_attendance_days: '' });
  }, [item]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = item
      ? api.patch(`/courses/${item.id}/`, formData)
      : api.post('/courses/', formData);
    
    try {
      await toast.promise(promise, {
        loading: `${item ? 'Updating' : 'Creating'} course...`,
        success: `Course ${item ? 'updated' : 'created'}!`,
        error: (err) => err.response?.data?.detail || 'An error occurred.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Course' : 'Add New Course'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Code" name="code" value={formData.code} onChange={handleChange} required />
        <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <FormInput label="Duration (Weeks)" name="duration_weeks" value={formData.duration_weeks} onChange={handleChange} type="number" required />
        <FormInput label="Total Fees" name="total_fees" value={formData.total_fees} onChange={handleChange} type="number" step="0.01" required />
        <FormInput label="Required Attendance" name="required_attendance_days" value={formData.required_attendance_days} onChange={handleChange} type="number" required />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Course'}
        </button>
      </form>
    </Modal>
  );
};

// --- Batch Modal (Add/Edit) ---
const BatchModal = ({ isOpen, onClose, onSuccess, item, courses, trainers }) => {
  const [formData, setFormData] = useState({ code: '', course: '', trainer: '', capacity: '10' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) setFormData({ ...item, course: item.course.id, trainer: item.trainer.id });
    else setFormData({ code: '', course: courses[0]?.id || '', trainer: trainers[0]?.id || '', capacity: '10' });
  }, [item, courses, trainers]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData, course: parseInt(formData.course), trainer: parseInt(formData.trainer) };
    const promise = item
      ? api.patch(`/batches/${item.id}/`, payload)
      : api.post('/batches/', payload);
    
    try {
      await toast.promise(promise, {
        loading: `${item ? 'Updating' : 'Creating'} batch...`,
        success: `Batch ${item ? 'updated' : 'created'}!`,
        error: (err) => err.response?.data?.code?.[0] || 'An error occurred.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Batch' : 'Add New Batch'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Batch Code" name="code" value={formData.code} onChange={handleChange} required />
        <FormInput label="Capacity" name="capacity" value={formData.capacity} onChange={handleChange} type="number" required />
        <div>
          <label className="form-label">Course</label>
          <select name="course" value={formData.course} onChange={handleChange} className="form-input">
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Trainer</label>
          <select name="trainer" value={formData.trainer} onChange={handleChange} className="form-input">
            {trainers.map(t => <option key={t.id} value={t.id}>{t.trainer_name}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Batch'}
        </button>
      </form>
    </Modal>
  );
};

// --- Trainer Modal (Add/Edit) ---
const TrainerModal = ({ isOpen, onClose, onSuccess, item, users }) => {
  const [formData, setFormData] = useState({ user: '', emp_no: '', join_date: '', salary: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) setFormData({ ...item, user: item.user.id });
    else setFormData({ user: users[0]?.id || '', emp_no: '', join_date: new Date().toISOString().split('T')[0], salary: '' });
  }, [item, users]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData, user: parseInt(formData.user) };
    const promise = item
      ? api.patch(`/trainers/${item.id}/`, payload)
      : api.post('/trainers/', payload);
    
    try {
      await toast.promise(promise, {
        loading: `${item ? 'Updating' : 'Creating'} trainer...`,
        success: `Trainer ${item ? 'updated' : 'created'}!`,
        error: (err) => err.response?.data?.detail || 'An error occurred.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Trainer' : 'Add New Trainer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">User Account</label>
          <select name="user" value={formData.user} onChange={handleChange} className="form-input" disabled={!!item}>
            {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.first_name} {u.last_name})</option>)}
          </select>
          {item && <p className="text-xs text-muted-foreground">User account cannot be changed after creation.</p>}
        </div>
        <FormInput label="Employee No." name="emp_no" value={formData.emp_no} onChange={handleChange} required />
        <FormInput label="Join Date" name="join_date" value={formData.join_date} onChange={handleChange} type="date" required />
        <FormInput label="Salary" name="salary" value={formData.salary} onChange={handleChange} type="number" step="0.01" required />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Trainer'}
        </button>
      </form>
    </Modal>
  );
};

// --- List Component for Tab Content ---
const ListComponent = ({ items, onEdit, columns, loading }) => (
  loading ? (
    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
  ) : (
    <ul role="list" className="divide-y divide-border">
      {items.map(item => (
        <li key={item.id} className="flex items-center justify-between p-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            {columns.map(col => (
              <div key={col.key}>
                <p className="text-xs text-muted-foreground">{col.label}</p>
                <p className="text-sm font-medium text-foreground">{item[col.key]}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onEdit(item)} className="btn-outline btn-sm ml-4">
            <Edit size={16} />
          </button>
        </li>
      ))}
    </ul>
  )
);

// --- Main Page Component ---
function CourseManagementPage() {
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ courses: [], batches: [], trainers: [], users: [] });
  const [modal, setModal] = useState({ type: null, item: null }); // type: 'course', 'batch', 'trainer'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, batchesRes, trainersRes, usersRes] = await Promise.all([
        api.get('/courses/'),
        api.get('/batches/'),
        api.get('/trainers/'),
        api.get('/users/', { params: { is_staff: true } }) // Get staff users for trainer creation
      ]);
      setData({
        courses: coursesRes.data.results || [],
        batches: batchesRes.data.results || [],
        trainers: trainersRes.data.results || [],
        users: usersRes.data.results || []
      });
    } catch (err) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type, item = null) => setModal({ type, item });
  const closeModal = () => setModal({ type: null, item: null });

  const tabs = [
    { id: 'courses', label: 'Courses', icon: Book },
    { id: 'batches', label: 'Batches', icon: Briefcase },
    { id: 'trainers', label: 'Trainers', icon: UserCheck },
  ];

  return (
    <>
      <PageHeader title="Course Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => openModal(activeTab)}>
          <Plus size={18} />
          Add New {activeTab.slice(0, -1)}
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Tabs */}
          <div className="mb-6 border-b border-border">
            <nav className="flex -mb-px space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="card overflow-hidden">
            {activeTab === 'courses' && (
              <ListComponent
                loading={loading}
                items={data.courses}
                onEdit={(item) => openModal('course', item)}
                columns={[
                  { label: 'Title', key: 'title' },
                  { label: 'Code', key: 'code' },
                  { label: 'Fees', key: 'total_fees' }
                ]}
              />
            )}
            {activeTab === 'batches' && (
              <ListComponent
                loading={loading}
                items={data.batches.map(b => ({...b, course_title: b.course?.title, trainer_name: b.trainer?.trainer_name}))}
                onEdit={(item) => openModal('batch', item)}
                columns={[
                  { label: 'Code', key: 'code' },
                  { label: 'Course', key: 'course_title' },
                  { label: 'Trainer', key: 'trainer_name' }
                ]}
              />
            )}
            {activeTab === 'trainers' && (
              <ListComponent
                loading={loading}
                items={data.trainers.map(t => ({...t, name: t.trainer_name, email: t.user?.email}))}
                onEdit={(item) => openModal('trainer', item)}
                columns={[
                  { label: 'Name', key: 'name' },
                  { label: 'Employee No', key: 'emp_no' },
                  { label: 'Email', key: 'email' }
                ]}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <CourseModal isOpen={modal.type === 'course'} onClose={closeModal} onSuccess={fetchData} item={modal.item} />
      <BatchModal isOpen={modal.type === 'batch'} onClose={closeModal} onSuccess={fetchData} item={modal.item} courses={data.courses} trainers={data.trainers} />
      <TrainerModal isOpen={modal.type === 'trainer'} onClose={closeModal} onSuccess={fetchData} item={modal.item} users={data.users} />
    </>
  );
}

export default CourseManagementPage;