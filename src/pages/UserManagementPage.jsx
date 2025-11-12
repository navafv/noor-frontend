import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Users, Save, Shield } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/users/'),
        api.get('/roles/')
      ]);
      setUsers(usersRes.data.results || []);
      setRoles(rolesRes.data.results || []);
    } catch (err) {
      setError('Could not fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaved = () => {
    fetchUsers();
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="User Management" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New User
            </button>
          </div>

          {loading && <div className="flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {users.map(user => (
                  <li key={user.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{user.first_name} {user.last_name} ({user.username})</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.is_staff && <span className="status-badge status-active">Staff</span>}
                      {user.role && <span className="status-badge status-follow_up">{user.role.name}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
        <UserForm roles={roles} onSaved={handleSaved} />
      </Modal>
    </div>
  );
}

function UserForm({ roles, onSaved }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    is_staff: false,
    role_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = { ...formData, role_id: formData.role_id || null };

    try {
      // This hits the new UserCreateSerializer
      await api.post('/users/', payload);
      onSaved();
    } catch (err) {
      const errors = err.response?.data;
      if (errors?.username) setError(`Username: ${errors.username[0]}`);
      else if (errors?.password) setError(`Password: ${errors.password[0]}`);
      else setError('Failed to create user. That username may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">First Name</label><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="form-input" required /></div>
        <div><label className="form-label">Last Name</label><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="form-input" /></div>
      </div>
      <div><label className="form-label">Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" required /></div>
      <div><label className="form-label">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required /></div>
      <div><label className="form-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" /></div>
      <div><label className="form-label">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" /></div>
      <div><label className="form-label">Role</label><select name="role_id" value={formData.role_id || ''} onChange={handleChange} className="form-input"><option value="">-- No Role --</option>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
      
      {/* THIS IS THE KEY CHECKBOX */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_staff" id="is_staff" checked={formData.is_staff} onChange={handleChange} className="h-4 w-4 rounded border-border" />
        <label htmlFor="is_staff" className="form-label mb-0 select-none">
          Mark as Staff (Teacher)
        </label>
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Create User'}</button>
    </form>
  );
}

export default UserManagementPage;