import cron from 'node-cron';
import { fetchFlights } from './services/flightService';

// Scheduler yang berjalan setiap menit dan menulis ke console log
// setInterval(() => {
//   const now = new Date();
//   console.log(`[Scheduler] Menit: ${now.toLocaleTimeString()}`);
// }, 60 * 1000); // 60 detik

// Schedule to run every day at 20:10 (8:10 PM)
cron.schedule('10 20 * * *', async () => {
  console.log('[Scheduler] Running fetchFlights at', new Date().toISOString());
  try {
    await fetchFlights();
    console.log('[Scheduler] fetchFlights completed');
  } catch (err) {
    console.error('[Scheduler] fetchFlights error:', err);
  }
});

// Keep process alive if run directly
if (require.main === module) {
  console.log('[Scheduler] Started. Waiting for scheduled jobs...');
  setInterval(() => {}, 1 << 30);
}

// Export agar bisa di-import di index.ts jika perlu
export {};
