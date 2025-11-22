import React from 'react';
import { Scissors, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden items-center justify-center">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '2s'}} />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 text-primary-600 -rotate-3 transform hover:rotate-0 transition-transform duration-300">
          <Scissors size={48} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Noor <span className="text-primary-600">Institute</span>
        </h1>
        
        <p className="text-gray-500 mb-10 leading-relaxed max-w-xs mx-auto">
          Excellence in Fashion Design & Stitching. Manage your courses and progress.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <Link 
            to="/login" 
            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Student / Staff Login <ArrowRight size={18}/>
          </Link>
          
          <Link 
            to="/verify" 
            className="w-full bg-white text-gray-700 border border-gray-200 font-semibold py-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} /> Verify Certificate
          </Link>

          <Link 
            to="/download-app" 
            className="mt-6 text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-1 py-2"
          >
            <Smartphone size={16} /> Download Mobile App
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-[10px] text-gray-300 z-10">
        © {new Date().getFullYear()} Noor Institute
      </footer>
    </div>
  );
};

export default HomePage;