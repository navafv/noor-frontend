import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const AdminCourseMaterialsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.link) data.append('link', formData.link);
    if (file) data.append('file', file);

    try {
      await api.post(`/courses/${selectedCourse}/materials/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Material uploaded');
      setIsModalOpen(false);
      fetchMaterials(selectedCourse);
      setFormData({ title: '', description: '', link: '' });
      setFile(null);
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this material?")) return;
    try {
      await api.delete(`/courses/${selectedCourse}/materials/${id}/`);
      toast.success("Deleted");
      fetchMaterials(selectedCourse);
    } catch(e) { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Course Materials</h2>

      {/* Course Selector */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course to Manage</label>
        <select className="form-input" value={selectedCourse} onChange={handleCourseChange}>
            <option value="">-- Choose Course --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* Add Button */}
      {selectedCourse && (
        <button onClick={() => setIsModalOpen(true)} className="w-full py-3 border-2 border-dashed border-primary-200 rounded-2xl text-primary-600 font-semibold hover:bg-primary-50 flex items-center justify-center gap-2">
            <Upload size={20} /> Upload New Material
        </button>
      )}

      {/* List */}
      <div className="space-y-3">
        {materials.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                        {m.link ? <LinkIcon size={20}/> : <FileText size={20}/>}
                    </div>
                    <div className="truncate">
                        <p className="font-bold text-gray-900 truncate">{m.title}</p>
                        <p className="text-xs text-gray-500 truncate">{m.description || "No description"}</p>
                    </div>
                </div>
                <button onClick={() => handleDelete(m.id)} className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100">
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Material">
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Title" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <textarea placeholder="Description" className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Attachment Type</p>
                <div className="flex gap-2 text-xs">
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Provide Link OR File</span>
                </div>
                <input type="url" placeholder="External Link (Optional)" className="form-input" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                <div className="relative">
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" onChange={e => setFile(e.target.files[0])} />
                </div>
            </div>

            <button type="submit" className="w-full btn-primary mt-2">Upload</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCourseMaterialsPage;