module.exports = {
  apps: [
    {
      name: 'ecommerce-api',
      script: 'backend/src/app.js',
      instances: 'max', // Utilize all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
