module.exports = {
  apps: [
    {
      name: "bagsbe-app",
      script: "src/index.ts",
      instances: 1,
      exec_mode: "fork", // ganti ke mode fork
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production"
      },
      // Jika Anda menggunakan ts-node, gunakan interpreter berikut:
      interpreter: "./node_modules/.bin/ts-node",
      interpreter_args: "-r tsconfig-paths/register"
    }
  ]
};
