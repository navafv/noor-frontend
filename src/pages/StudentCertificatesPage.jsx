import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Award, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentCertificatesPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my-certificates/')
      .then(res => setCerts(res.data.results || []))
      .catch(() => toast.error("Failed to load certificates"))
      .finally(() => setLoading(false));
  }, []);

  const downloadCert = async (id, certNo) => {
    try {
        const response = await api.get(`/certificates/${id}/download/`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${certNo}.pdf`);
        document.body.appendChild(link);
        link.click();
    } catch (e) { toast.error("Download failed"); }
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Certificates</h2>
      
      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       certs.length === 0 ? <div className="text-center py-10 text-gray-400">No certificates earned yet.</div> : (
         <div className="space-y-3">
           {certs.map(cert => (
             <div key={cert.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-50 rounded-full opacity-50"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-yellow-100 text-yellow-700 p-2 rounded-xl"><Award size={24}/></div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{cert.course_title}</h3>
                            <p className="text-xs text-gray-500">{cert.certificate_no}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                        <span className="text-xs text-gray-400">Issued: {cert.issue_date}</span>
                        <button 
                            onClick={() => downloadCert(cert.id, cert.certificate_no)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-gray-900 text-white px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default StudentCertificatesPage;