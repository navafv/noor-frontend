import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ShieldCheck, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Blob */}
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-20%] w-96 h-96 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 text-primary-600 transform rotate-3">
          <Scissors size={40} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Master the Art of <span className="text-primary-600">Stitching</span>
        </h1>
        
        <p className="text-gray-500 mb-10 leading-relaxed max-w-xs">
          Noor Institute provides professional stitching and fashion design courses. Manage your learning journey with our app.
        </p>

        <div className="w-full max-w-xs space-y-4">
          <Link 
            to="/login" 
            className="w-full block bg-gray-900 text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Student / Staff Login <ArrowRight size={18}/>
          </Link>
          
          <Link 
            to="/verify" 
            className="w-full block bg-white text-gray-700 border border-gray-200 font-semibold py-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} /> Verify Certificate
          </Link>
        </div>
      </div>

      <footer className="p-6 text-center text-xs text-gray-400 relative z-10">
        © {new Date().getFullYear()} Noor Institute. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;