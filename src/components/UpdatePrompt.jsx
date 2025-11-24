import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
// We assume you are using vite-plugin-pwa's virtual module
// If not configured, this import might fail - ensure vite-plugin-pwa is in package.json
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-4 max-w-sm">
        <div className="bg-primary/20 p-2 rounded-full">
          <RefreshCw className="w-5 h-5 text-primary-light" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Update Available</h4>
          <p className="text-xs text-gray-300">A new version of the app is ready.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setNeedRefresh(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={() => updateServiceWorker(true)}
            className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-xs font-bold rounded-lg transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;