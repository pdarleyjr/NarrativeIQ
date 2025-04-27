
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Workbox } from 'workbox-window';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Application starting...');

// Register service worker for PWA support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const wb = new Workbox('/sw.js');
  
  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      if (confirm('New version available! Reload to update?')) {
        window.location.reload();
      }
    }
  });

  wb.register()
    .then(() => console.log('Service worker registered'))
    .catch(error => console.error('Service worker registration failed:', error));
}

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  console.log('Root element found, mounting application');
  
  const root = createRoot(rootElement);
  root.render(<App />);
  
  console.log('Application mounted successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  
  // Try to render a fallback error message
  try {
    document.body.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; font-family:sans-serif;">
        <h1>Something went wrong</h1>
        <p>Please check the console for more information</p>
      </div>
    `;
  } catch (e) {
    console.error('Could not render fallback UI:', e);
  }
}
