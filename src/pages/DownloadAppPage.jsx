import React from 'react';
import { Smartphone, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DownloadAppPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary-600 to-primary-800 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
      
      <Link to="/" className="absolute top-6 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors">
        <ArrowLeft size={24} />
      </Link>

      <div className="z-10 text-center max-w-sm w-full">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl mx-auto mb-8 flex items-center justify-center text-primary-600 rotate-3">
            <Smartphone size={48} />
        </div>

        <h1 className="text-3xl font-bold mb-4">Get the App</h1>
        <p className="text-primary-100 mb-8 leading-relaxed">
            Experience the full Noor Institute portal on your mobile device. Notifications, offline access, and smoother navigation.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 shrink-0"/> <span>Push Notifications</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 shrink-0"/> <span>Fast Biometric Login</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 shrink-0"/> <span>Offline Course Materials</span>
            </div>
        </div>

        <a 
            href="/noor-app.apk" 
            download="NoorInstitute.apk"
            className="w-full bg-white text-primary-700 font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-100 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
            <Download size={20} /> Download APK (v1.0)
        </a>
        
        <p className="text-xs text-primary-200 mt-4">
            Android 8.0+ • 15MB • Secure Download
        </p>
      </div>
    </div>
  );
};

export default DownloadAppPage;