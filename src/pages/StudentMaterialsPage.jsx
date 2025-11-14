import React, { useState, useEffect } from 'react';
import api from '@/services/api.js';
import { Loader2, Download, Link as LinkIcon, BookOpen, Package } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';
import { useResponsive } from '../hooks/useResponsive.js';

// ... (groupMaterialsByCourse is unchanged)
const groupMaterialsByCourse = (materials) => {
  return materials.reduce((acc, material) => {
    const courseTitle = material.course_title || 'Uncategorized';
    if (!acc[courseTitle]) {
      acc[courseTitle] = [];
    }
    acc[courseTitle].push(material);
    return acc;
  }, {});
};

function StudentMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile } = useResponsive();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/my-materials/');
        setMaterials(res.data.results || []);
      } catch (err) {
        setError('Failed to load course materials.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);
  
  // --- UPDATED DOWNLOAD HANDLER ---
  const handleDownload = async (material) => {
    if (downloadingId === material.id) return;
    setDownloadingId(material.id);
    setError(null);
    
    try {
      // --- THIS IS THE FIX ---
      // Call our new, secure API endpoint
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

  const groupedMaterials = groupMaterialsByCourse(materials);
  const courses = Object.keys(groupedMaterials);

  if (loading) {
    // ... (no change)
    return (
      <>
        {isMobile && <PageHeader title="My Course Materials" />}
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }

  return (
    <>
      {isMobile && <PageHeader title="My Course Materials" />}
      
      <div className="p-4 lg:p-8 max-w-lg mx-auto lg:max-w-4xl pb-20">
        {error && <p className="form-error mb-4">{error}</p>}
        
        {courses.length === 0 ? (
          // ... (no change)
          <div className="card text-center p-10 text-muted-foreground">
            <Package size={40} className="mx-auto" />
            <p className="mt-4 font-semibold">No materials found</p>
            <p className="text-sm mt-1">
              Your instructor has not added any materials for your active courses yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map(courseTitle => (
              <div key={courseTitle} className="card">
                <h2 className="text-lg font-semibold text-foreground p-4 border-b border-border flex items-center">
                  <BookOpen size={20} className="mr-3 text-primary" />
                  {courseTitle}
                </h2>
                <ul className="divide-y divide-border">
                  {groupedMaterials[courseTitle].map(material => (
                    <li key={material.id} className="p-4">
                      <p className="font-semibold text-foreground">{material.title}</p>
                      {material.description && (
                        <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                      )}
                      
                      {material.file && (
                        <button 
                          onClick={() => handleDownload(material)}
                          disabled={downloadingId === material.id}
                          className="btn-secondary btn-sm flex items-center gap-2 mt-3 w-fit disabled:opacity-50"
                        >
                          {downloadingId === material.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                          Download File
                        </button>
                      )}
                      {material.link && (
                        <a 
                          href={material.link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-secondary btn-sm flex items-center gap-2 mt-3 w-fit"
                        >
                          <LinkIcon size={16} />
                          Open Link
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentMaterialsPage;