webServer: [
    {
      command: 'node server.js',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node shop-server.js',
      port: 4000,
      reuseExistingServer: !process.env.CI,
    },
  ],