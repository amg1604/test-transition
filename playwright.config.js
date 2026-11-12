// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 1,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: 'https://smart-dev.allianz.com',
    // Headless in CI (no display on the agent); headed locally
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Client certificate for mutual TLS login.
    // Locally: Edge uses the cert from the Windows store (nothing to set).
    // CI (Jenkins): set CERT_PFX_PATH + CERT_PASSPHRASE (injected from Jenkins credentials).
    // To export a PFX locally: scripts/export-cert.ps1
    ...(process.env.CERT_PFX_PATH && {
      clientCertificates: [
        {
          origin: 'https://smart-dev.allianz.com',
          pfxPath: process.env.CERT_PFX_PATH,
          passphrase: process.env.CERT_PASSPHRASE,
        },
      ],
    }),
  },

  projects: [
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
