import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Shield, Edit } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// --- Role Modal (Add/Edit) ---
const RoleModal = ({ isOpen, onClose, onSuccess, item }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!item;

  useEffect(() => {
    if (item) setFormData({ name: item.name, description: item.description });
    else setFormData({ name: '', description: '' });
  }, [item]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const promise = isEditing
      ? api.patch(`/roles/${item.id}/`, formData)
      : api.post('/roles/', formData);
    
    try {
      await toast.promise(promise, {
        loading: `${isEditing ? 'Updating' : 'Creating'} role...`,
        success: `Role ${isEditing ? 'updated' : 'created'}!`,
        error: (err) => err.response?.data?.name?.[0] || 'An error occurred.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Role' : 'Add New Role'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Role Name" name="name" value={formData.name} onChange={handleChange} required />
        <FormInput label="Description" name="description" value={formData.description} onChange={handleChange} />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Role'}
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
function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, item: null });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles/');
      setRoles(res.data.results || []);
    } catch (err) {
      toast.error('Failed to load roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <PageHeader title="Role Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ isOpen: true, item: null })}>
          <Plus size={18} />
          Add Role
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : roles.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No roles found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {roles.map((role) => (
                  <li key={role.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <button onClick={() => setModal({ isOpen: true, item: role })} className="btn-outline btn-sm">
                      <Edit size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <RoleModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSuccess={fetchRoles}
        item={modal.item}
      />
    </>
  );
}

export default RoleManagementPage;