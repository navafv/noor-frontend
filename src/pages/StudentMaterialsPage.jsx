import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get('/my-materials/');
        setMaterials(res.data.results || []);
      } catch (error) {
        console.error(error);
        toast.error("Could not load materials");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleDownload = async (courseId, materialId, fileName) => {
    try {
      const response = await api.get(`/courses/${courseId}/materials/${materialId}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Learning Materials</h2>

      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       materials.length === 0 ? (
         <div className="text-center py-10 bg-white rounded-3xl border border-gray-100">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No materials uploaded yet.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {materials.map((item) => (
             <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
               <div className="bg-primary-50 p-3 rounded-xl text-primary-600 mt-1">
                 <FileText size={24} />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-gray-900">{item.title}</h3>
                 <p className="text-xs text-primary-600 font-medium mb-1">{item.course_title}</p>
                 {item.description && <p className="text-sm text-gray-500 mb-3">{item.description}</p>}
                 
                 {item.link ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
                    >
                      <ExternalLink size={14} /> Open Link
                    </a>
                 ) : (
                    <button 
                      onClick={() => handleDownload(item.course, item.id, item.title)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg"
                    >
                      <Download size={14} /> Download File
                    </button>
                 )}
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default StudentMaterialsPage;