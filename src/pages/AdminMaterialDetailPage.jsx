import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2, Link as LinkIcon, File, Package, Upload, Download } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx';

function AdminMaterialDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchMaterials = useCallback(async () => {
    // ... (no change)
    try {
      setLoading(true);
      setError(null);
      const [courseRes, materialsRes] = await Promise.all([
        api.get(`/courses/${courseId}/`),
        api.get(`/courses/${courseId}/materials/`)
      ]);
      setCourse(courseRes.data);
      setMaterials(materialsRes.data.results || []);
    } catch (err) {
      setError('Failed to load course materials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (materialId) => {
    // ... (no change)
    setDeletingId(materialId);
    try {
      await api.delete(`/courses/${courseId}/materials/${materialId}/`);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
    } catch (err) {
      setError('Failed to delete material.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = () => {
    // ... (no change)
    setIsModalOpen(false);
    fetchMaterials();
  };
  
  // --- UPDATED DOWNLOAD HANDLER ---
  const handleDownload = async (material) => {
    if (downloadingId === material.id) return;
    setDownloadingId(material.id);
    setError(null);
    
    try {
      // --- THIS IS THE FIX ---
      const response = await api.get(
        `/courses/${material.course}/materials/${material.id}/download/`, 
        {
          responseType: 'blob',
        }
      );
      // --- END FIX ---

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = material.file.split('/').pop();
      link.setAttribute('download', filename); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file", err);
      setError("Could not download file.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    // ... (no change)
    return (
      <>
        <PageHeader title="Loading Materials..." />
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={course ? `Materials for ${course.title}` : 'Course Materials'} />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Add New Material
            </button>
          </div>

          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && materials.length === 0 && (
            // ... (no change)
            <div className="text-center p-10 card">
              <Package size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Materials Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click "Add New Material" to upload a file or add a link.
              </p>
            </div>
          )}

          {!loading && !error && materials.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {materials.map((m) => (
                  <li key={m.id} className="p-4 flex justify-between items-start gap-4">
                    <div className="shrink-0">
                      {m.file ? <File size={24} className="text-primary" /> : <LinkIcon size={24} className="text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      
                      {m.file && (
                        <button 
                          onClick={() => handleDownload(m)}
                          disabled={downloadingId === m.id}
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-1 disabled:opacity-50"
                        >
                          {downloadingId === m.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}
                          {m.file.split('/').pop()}
                        </button>
                      )}
                      {m.link && (
                        <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                          {m.link}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                      className="btn-destructive btn-sm"
                    >
                      {deletingId === m.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Add Material Modal (no change) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Add Material to ${course?.title}`}
      >
        <CourseMaterialForm 
          courseId={courseId} 
          onSaved={handleSaved} 
        />
      </Modal>
    </div>
  );
}

// --- Form Component (no change) ---
// ... (rest of the file is unchanged) ...
function CourseMaterialForm({ courseId, onSaved }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    if (uploadType === 'file' && file) {
      data.append('file', file);
    } else if (uploadType === 'link' && formData.link) {
      data.append('link', formData.link);
    } else {
      setError('Please provide either a file or a link.');
      setLoading(false);
      return;
    }

    try {
      await api.post(`/courses/${courseId}/materials/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.[0] || 'Failed to add material. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div className="flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => setUploadType('file')}
          className={`btn rounded-r-none ${uploadType === 'file' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Upload size={18} className="mr-2" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadType('link')}
          className={`btn rounded-l-none -ml-px ${uploadType === 'link' ? 'btn-primary' : 'btn-outline'}`}
        >
          <LinkIcon size={18} className="mr-2" /> Add Link
        </button>
      </div>

      <div>
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="form-input" required />
      </div>

      {uploadType === 'file' ? (
        <div>
          <label htmlFor="file" className="form-label">File</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} className="form-input" required />
        </div>
      ) : (
        <div>
          <label htmlFor="link" className="form-label">Link (URL)</label>
          <input type="url" name="link" id="link" value={formData.link} onChange={handleChange} className="form-input" required placeholder="https://www.youtube.com/watch?v=..." />
        </div>
      )}

      <div>
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" />
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Add Material'}
      </button>
    </form>
  );
}

export default AdminMaterialDetailPage;