// Scheduler yang berjalan setiap menit dan menulis ke console log
setInterval(() => {
  const now = new Date();
  console.log(`[Scheduler] Menit: ${now.toLocaleTimeString()}`);
}, 60 * 1000); // 60 detik

// Export agar bisa di-import di index.ts jika perlu
export {};
