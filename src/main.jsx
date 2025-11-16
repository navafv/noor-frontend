import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import ThemeProvider from '@/context/ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);