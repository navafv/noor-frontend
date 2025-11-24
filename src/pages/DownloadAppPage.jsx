import React from 'react';
import { Smartphone, Download, CheckCircle, ArrowLeft, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DownloadAppPage = () => {
  const appDetails = [
    { label: "Version", value: "1.0.0" },
    { label: "Size", value: "53 MB" }, 
    { label: "Requires", value: "Android 8.0+" }, 
    { label: "Updated", value: "Nov 24, 2025" }, 
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-primary-600 to-primary-800 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
      
      <Link to="/" className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors">
        <ArrowLeft size={24} />
      </Link>

      <div className="z-10 text-center max-w-sm w-full">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl mx-auto mb-6 flex items-center justify-center text-primary-600 rotate-3">
            <Smartphone size={48} />
        </div>

        <h1 className="text-3xl font-bold mb-2">Noor Institute App</h1>
        <p className="text-primary-100 mb-8 leading-relaxed text-sm">
            The official mobile companion for students and staff. Manage your academic life on the go.
        </p>

        {/* App Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            {appDetails.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                    <p className="text-xs text-primary-200 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="font-bold text-lg">{item.value}</p>
                </div>
            ))}
        </div>

        {/* Features List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 shrink-0"/> <span className="text-sm">Instant Attendance Updates</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 shrink-0"/> <span className="text-sm">Fee History & PDF Receipts</span>
            </div>
            <div className="flex items-center gap-3">
                <Shield size={20} className="text-green-400 shrink-0"/> <span className="text-sm">Verify Digital Certificates</span>
            </div>
        </div>

        {/* Download Action */}
        <a 
            href="/noor-app.apk" 
            download="NoorInstitute.apk"
            className="w-full bg-white text-primary-700 font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-100 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
            <Download size={20} /> Download APK
        </a>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-primary-200 opacity-80">
            <Info size={14} />
            <p>Secure download from official server</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;