module.exports = {
  apps: [
    {
      name: "bagsbe-app",
      script: "dist/index.js", // jalankan hasil build js
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production"
      }
      // interpreter dan interpreter_args dihapus karena sudah JS
    }
  ]
};
