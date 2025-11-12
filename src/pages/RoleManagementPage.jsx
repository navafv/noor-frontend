import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Users, Save } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx';

/**
 * Page for creating and managing user roles.
 * Admin-only feature.
 */
function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // For editing

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/roles/');
      setRoles(response.data.results || response.data || []); // Handle paginated or non-paginated
    } catch (err) {
      setError('Could not fetch roles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openModal = (role = null) => {
    setSelectedRole(role); // If role is null, it's a "New" form
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    fetchRoles(); // Refresh the list
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Role Management" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-2xl">
          
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal(null)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Role
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && roles.length === 0 && (
            <div className="text-center p-10 card">
              <Users size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Roles Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click "New Role" to create one.
              </p>
            </div>
          )}

          {/* Roles List */}
          {!loading && !error && roles.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {roles.map((role) => (
                  <li key={role.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{role.description || 'No description'}</p>
                    </div>
                    <button 
                      onClick={() => openModal(role)}
                      className="btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Role Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRole ? 'Edit Role' : 'Create New Role'}
      >
        <RoleForm 
          role={selectedRole}
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      </Modal>
    </div>
  );
}

// --- Form Component for the Modal ---
function RoleForm({ role, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!role;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [role, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        // Update (PATCH)
        await api.patch(`/roles/${role.id}/`, formData);
      } else {
        // Create (POST)
        await api.post('/roles/', formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'A role with this name may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div>
        <label htmlFor="name" className="form-label">Role Name</label>
        <input
          type="text" name="name" id="name"
          value={formData.name} onChange={handleChange}
          className="form-input" required
          placeholder="e.g., Admin, Teacher, Student"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea
          name="description" id="description"
          value={formData.description} onChange={handleChange}
          className="form-input" rows="3"
        />
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            <Save size={18} className="mr-2" />
            {isEditing ? 'Save Changes' : 'Create Role'}
          </>
        )}
      </button>
    </form>
  );
}

export default RoleManagementPage;