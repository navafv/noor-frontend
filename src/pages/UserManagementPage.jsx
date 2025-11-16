import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Users, Search, Edit, Shield } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';
import Pagination from '../components/Pagination.jsx'; // <-- NEW

// --- User Modal (Add/Edit) ---
const UserModal = ({ isOpen, onClose, onSuccess, item, roles }) => {
  const [formData, setFormData] = useState({
    username: '', first_name: '', last_name: '', email: '', phone: '',
    role_id: '', password: '', is_staff: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        username: item.username,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        role_id: item.role?.id || '',
        is_staff: item.is_staff,
        password: '', // Password is write-only
      });
    } else {
      setFormData({
        username: '', first_name: '', last_name: '', email: '', phone: '',
        role_id: roles[0]?.id || '', password: '', is_staff: false
      });
    }
  }, [item, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Prepare payload
    const payload = { ...formData, role_id: parseInt(formData.role_id) };
    if (!isEditing && !payload.password) {
      toast.error('Password is required for new users.');
      setIsLoading(false);
      return;
    }
    if (isEditing) delete payload.password; // Don't send empty password on edit

    const promise = isEditing
      ? api.patch(`/users/${item.id}/`, payload)
      : api.post('/users/', payload); // Uses UserCreateSerializer
    
    try {
      await toast.promise(promise, {
        loading: `${isEditing ? 'Updating' : 'Creating'} user...`,
        success: `User ${isEditing ? 'updated' : 'created'}!`,
        error: (err) => err.response?.data?.username?.[0] || 'An error occurred.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} required />
        <FormInput label="Password" name="password" type="password" onChange={handleChange} required={!isEditing} placeholder={isEditing ? 'Leave blank to keep unchanged' : ''} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <FormInput label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <div>
          <label className="form-label">Role</label>
          <select name="role_id" value={formData.role_id} onChange={handleChange} className="form-input">
            <option value="">-- No Role --</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleChange} className="h-4 w-4 rounded" />
          <label htmlFor="is_staff" className="form-label mb-0">Is Staff (Teacher/Admin)</label>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save User'}
        </button>
      </form>
    </Modal>
  );
};

// Helper component
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);

// --- Main Page Component ---
function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, item: null });
  const [page, setPage] = useState(1); // <-- Page state
  const [totalPages, setTotalPages] = useState(1); // <-- Total pages state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: searchTerm });
      const [usersRes, rolesRes] = await Promise.all([
        api.get(`/users/?${params.toString()}`),
        api.get('/roles/')
      ]);
      setUsers(usersRes.data.results || []);
      setTotalPages(Math.ceil((usersRes.data.count || 0) / 20));
      setRoles(rolesRes.data.results || []);
    } catch (err) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="User Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ isOpen: true, item: null })}>
          <Plus size={18} />
          Add User
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by username, name, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : users.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No users found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {users.map((user) => (
                  <li key={user.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-primary">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="status-badge status-pending">{user.role?.name || 'No Role'}</span>
                      <button onClick={() => setModal({ isOpen: true, item: user })} className="btn-outline btn-sm">
                        <Edit size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* --- NEW: Pagination --- */}
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <UserModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSuccess={fetchData}
        item={modal.item}
        roles={roles}
      />
    </>
  );
}

export default UserManagementPage;