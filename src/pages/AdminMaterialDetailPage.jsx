import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Loader2, Plus, File, Link as LinkIcon, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// --- Add Material Modal ---
const AddMaterialModal = ({ isOpen, onClose, onSuccess, courseId }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);

    if (uploadType === 'file' && file) {
      payload.append('file', file);
    } else if (uploadType === 'link' && link) {
      payload.append('link', link);
    } else {
      toast.error('Please provide either a file or a link.');
      setIsLoading(false);
      return;
    }

    const promise = api.post(`/courses/${courseId}/materials/`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });

    try {
      await toast.promise(promise, {
        loading: 'Uploading material...',
        success: 'Material added successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to add material.'
      });
      setFormData({ title: '', description: '' });
      setFile(null);
      setLink('');
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Material">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <FormInput label="Description" name="description" value={formData.description} onChange={handleChange} />
        
        {/* Type Toggle */}
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button type="button" onClick={() => setUploadType('file')} className={`flex-1 p-2 rounded-md text-sm font-medium ${uploadType === 'file' ? 'bg-card shadow-sm' : ''}`}>Upload File</button>
          <button type="button" onClick={() => setUploadType('link')} className={`flex-1 p-2 rounded-md text-sm font-medium ${uploadType === 'link' ? 'bg-card shadow-sm' : ''}`}>Add Link</button>
        </div>

        {/* Dynamic Input */}
        {uploadType === 'file' ? (
          <FormInput label="File" name="file" onChange={(e) => setFile(e.target.files[0])} type="file" required />
        ) : (
          <FormInput label="URL Link" name="link" value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder="https://..." required />
        )}

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Material'}
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
function AdminMaterialDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, materialsRes] = await Promise.all([
        api.get(`/courses/${courseId}/`),
        api.get(`/courses/${courseId}/materials/`)
      ]);
      setCourse(courseRes.data);
      setMaterials(materialsRes.data.results || []);
    } catch (err) {
      toast.error('Failed to load course data.');
      navigate('/admin/materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    const promise = api.delete(`/courses/${courseId}/materials/${materialId}/`);
    
    try {
      await toast.promise(promise, {
        loading: 'Deleting material...',
        success: 'Material deleted.',
        error: 'Failed to delete material.'
      });
      fetchData(); // Refetch
    } catch (err) { /* handled by toast */ }
  };

  if (loading || !course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`Materials for ${course.title}`}>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Material
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="card overflow-hidden">
            {materials.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No materials found for this course.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {materials.map((mat) => (
                  <li key={mat.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {mat.file ? <File size={20} className="text-blue-500" /> : <LinkIcon size={20} className="text-green-500" />}
                      <div>
                        <p className="font-semibold text-foreground">{mat.title}</p>
                        <p className="text-sm text-muted-foreground">{mat.description}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(mat.id)} className="btn-outline btn-sm text-destructive hover:bg-destructive/10">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        courseId={courseId}
      />
    </>
  );
}

export default AdminMaterialDetailPage;