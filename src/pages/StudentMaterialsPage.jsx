import React, { useState, useEffect } from 'react';
import { Loader2, Download, Link as LinkIcon, Book } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Helper to group materials by course
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
  const [materialsByCourse, setMaterialsByCourse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        // This endpoint returns all materials for a student's *active* courses
        const res = await api.get('/my-materials/');
        const grouped = groupMaterialsByCourse(res.data.results || []);
        setMaterialsByCourse(grouped);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
        toast.error('Failed to load course materials.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const handleDownload = async (material) => {
    // The backend API for downloading is /courses/<course_pk>/materials/<pk>/download/
    
    // --- THIS IS NOW FIXED --- //
    const courseId = material.course; // This ID is now in the serializer
    if (!courseId) {
      toast.error('Could not find course ID for this material.');
      return;
    }
    
    const toastId = toast.loading('Downloading file...');
    try {
      const res = await api.get(
        `/courses/${courseId}/materials/${material.id}/download/`, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from the 'file' field URL
      const filename = material.file.split('/').pop();
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download complete!', { id: toastId });
    } catch (err) {
      console.error("Failed to download file:", err);
      toast.error('Download failed. Please try again.', { id: toastId });
    }
  };

  return (
    <>
      <PageHeader title="Course Materials" />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            Object.keys(materialsByCourse).length > 0 ? (
              Object.entries(materialsByCourse).map(([courseTitle, materials]) => (
                <section key={courseTitle}>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Book size={20} className="text-primary" />
                    {courseTitle}
                  </h2>
                  <div className="card overflow-hidden">
                    <ul role="list" className="divide-y divide-border">
                      {materials.map((material) => (
                        <li key={material.id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {material.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {material.description}
                            </p>
                          </div>
                          
                          {material.file ? (
                            <button
                              onClick={() => handleDownload(material)}
                              className="btn-outline btn-sm"
                            >
                              <Download size={16} className="mr-2" />
                              Download
                            </button>
                          ) : (
                            <a
                              href={material.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline btn-sm"
                            >
                              <LinkIcon size={16} className="mr-2" />
                              View Link
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))
            ) : (
              <div className="card p-8 text-center text-muted-foreground">
                No course materials found for your active courses.
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}

export default StudentMaterialsPage;