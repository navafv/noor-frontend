import api from '../services/api';

export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob', // Important: Handle response as binary data
    });

    // Create a temporary URL for the blob
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create a temporary link element and trigger the click
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename); // Force download with specific name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download file. Please try again.");
  }
};