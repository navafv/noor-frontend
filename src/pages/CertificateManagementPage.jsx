import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Award, Download, Plus, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const CertificateManagementPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ student: '', course: '', remarks: '' });

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates/');
      setCertificates(res.data.results || []);
    } catch (error) { toast.error("Failed to load certificates"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCertificates(); }, []);

  const openModal = async () => {
    const res = await api.get('/students/?active=true');
    setStudents(res.data.results || []);
    setIsModalOpen(true);
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setFormData({ ...formData, student: studentId, course: '' });
    if (studentId) {
      const res = await api.get(`/enrollments/?student=${studentId}`);
      setCourses(res.data.results || []);
    } else { setCourses([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates/', formData);
      toast.success("Certificate Issued!");
      setIsModalOpen(false);
      fetchCertificates();
      setFormData({ student: '', course: '', remarks: '' });
    } catch (error) {
      toast.error(error.response?.data?.non_field_errors?.[0] || "Failed to issue.");
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm("Toggle revoke status?")) return;
    try { await api.post(`/certificates/${id}/revoke/`); fetchCertificates(); } catch (e) { toast.error("Action failed"); }
  };

  const handleDownload = async (id) => {
    try {
        const response = await api.get(`/certificates/${id}/download/`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificate_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
    } catch (e) { toast.error("Download failed"); }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
        <button onClick={openModal} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer"><Plus size={24} /></button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : certificates.map(cert => (
            <div key={cert.id} className={`p-4 rounded-2xl shadow-sm border relative overflow-hidden ${cert.revoked ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-100'}`}>
                {cert.revoked && <div className="absolute right-0 top-0 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-bl-xl font-bold">REVOKED</div>}
                <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-xl ${cert.revoked ? 'bg-gray-200 text-gray-500' : 'bg-yellow-50 text-yellow-600'}`}><Award size={24} /></div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{cert.student_name}</h3>
                        <p className="text-sm text-primary-600 font-medium">{cert.course_title}</p>
                        <p className="text-xs text-gray-400 mt-1">Issued: {cert.issue_date}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
                    <button onClick={() => handleRevoke(cert.id)} className="px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg cursor-pointer">{cert.revoked ? "Activate" : "Revoke"}</button>
                    <button onClick={() => handleDownload(cert.id)} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer"><Download size={14}/> PDF</button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Certificate">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded-xl flex gap-2 text-yellow-800 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5"/>
                <p>Course must be completed to issue certificate.</p>
            </div>
            <select className="w-full p-3 rounded-xl border border-gray-200 outline-none bg-white" value={formData.student} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name}</option>)}
            </select>
            <select className="w-full p-3 rounded-xl border border-gray-200 outline-none bg-white" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} required disabled={!formData.student}>
                <option value="">Select Course</option>
                {courses.map(e => <option key={e.course_id} value={e.course_id}>{e.course_title} ({e.status})</option>)}
            </select>
            <textarea placeholder="Remarks" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer">Generate Certificate</button>
        </form>
      </Modal>
    </div>
  );
};

export default CertificateManagementPage;