import { registerSW } from 'virtual:pwa-register';

// Register the Service Worker using the generated entry point
// The immediate: true flag is critical for ensuring registration runs promptly.
registerSW({
  immediate: true,
  onRegistered(r) {
    if (r) {
      console.log('Service Worker registered successfully.');
    } else {
      console.error('Service Worker registration failed.');
    }
  },
  onNeedRefresh() {
    console.log('New content available, please refresh.');
  },
});