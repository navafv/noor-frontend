import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Trash2, FileText, Link as LinkIcon, Edit2, Download, ExternalLink } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const AdminCourseMaterialsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      const res = await api.get('/courses/?active=true');
      setCourses(res.data.results || []);
    };
    loadCourses();
  }, []);

  const fetchMaterials = async (courseId) => {
    if (!courseId) return;
    try {
      const res = await api.get(`/courses/${courseId}/materials/`);
      setMaterials(res.data.results || []);
    } catch (error) {
      toast.error("Failed to load materials");
    }
  };

  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setMaterials([]);
    if(id) fetchMaterials(id);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
        title: material.title,
        description: material.description,
        link: material.link || ''
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (formData.link && file) {
        toast.error("Cannot have both File and Link.");
        return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    if (formData.link) {
        data.append('link', formData.link);
        data.append('file', ''); 
    } else if (file) {
        data.append('file', file);
        data.append('link', ''); 
    } else if (!editingMaterial) {
         toast.error("Please provide a File or a Link.");
         return;
    }

    try {
      if (editingMaterial) {
        await api.patch(`/courses/${selectedCourse}/materials/${editingMaterial.id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Material updated');
      } else {
        await api.post(`/courses/${selectedCourse}/materials/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Material uploaded');
      }
      closeModal();
      fetchMaterials(selectedCourse);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingMaterial(null);
      setFormData({ title: '', description: '', link: '' });
      setFile(null);
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this material?")) return;
    try {
      await api.delete(`/courses/${selectedCourse}/materials/${id}/`);
      toast.success("Deleted");
      fetchMaterials(selectedCourse);
    } catch(e) { toast.error("Delete failed"); }
  };

  const handleDownload = async (material) => {
      if (material.link) {
          window.open(material.link, '_blank');
      } else {
          try {
            const response = await api.get(`/courses/${selectedCourse}/materials/${material.id}/download/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', material.title || 'download');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch(e) { toast.error("Download failed"); }
      }
  };

  const handleLinkChange = (e) => {
    setFormData({ ...formData, link: e.target.value });
    if (e.target.value) setFile(null);
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) setFormData({ ...formData, link: '' });
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Course Materials</h2>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
        <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none" value={selectedCourse} onChange={handleCourseChange}>
            <option value="">-- Choose Course --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <button onClick={() => setIsModalOpen(true)} className="w-full py-3 border-2 border-dashed border-primary-200 rounded-2xl text-primary-600 font-semibold hover:bg-primary-50 flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={20} /> Upload New Material
        </button>
      )}

      <div className="space-y-3">
        {materials.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600">{m.link ? <LinkIcon size={20}/> : <FileText size={20}/>}</div>
                    <div className="truncate">
                        <p className="font-bold text-gray-900 truncate">{m.title}</p>
                        <p className="text-xs text-gray-500 truncate">{m.description || "No description"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleDownload(m)} className="p-2 text-green-600 bg-green-50 rounded-full hover:bg-green-100 cursor-pointer">
                        {m.link ? <ExternalLink size={18} /> : <Download size={18} />}
                    </button>
                    <button onClick={() => handleEdit(m)} className="p-2 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 cursor-pointer">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 cursor-pointer">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMaterial ? "Edit Material" : "Upload Material"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <textarea placeholder="Description" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold">Attach (Choose One)</p>
                
                <div className="relative">
                    <input 
                        type="url" 
                        placeholder="External Link" 
                        className={`w-full p-3 rounded-xl border outline-none transition-colors ${file ? 'bg-gray-100 border-gray-200 text-gray-400' : 'border-gray-200'}`}
                        value={formData.link} 
                        onChange={handleLinkChange}
                        disabled={!!file}
                    />
                    {file && <div className="absolute right-3 top-3 text-xs text-gray-400 italic">File selected</div>}
                </div>

                <div className="relative">
                    <input 
                        type="file" 
                        className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 ${formData.link ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onChange={handleFileChange}
                        ref={ref => { if (ref && !file) ref.value = ''; }} 
                        disabled={!!formData.link}
                    />
                    {formData.link && <div className="absolute right-0 top-0 text-xs text-gray-400 italic mt-2">Link entered</div>}
                </div>
                
                {editingMaterial && (
                    <p className="text-xs text-orange-500">Note: Leaving both blank will keep the existing file/link.</p>
                )}
            </div>

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer">
                {editingMaterial ? "Update Material" : "Upload"}
            </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCourseMaterialsPage;