import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

if (!process.env.BASE_URL) throw new Error('BASE_URL is not set in .env');
if (!process.env.DEMO_USER) throw new Error('DEMO_USER is not set in .env');
if (!process.env.DEMO_PASS) throw new Error('DEMO_PASS is not set in .env');
if(!process.env.API_BASE_URL) throw new Error('API_BASE_URL is not set in .env');

export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  timeout: 40 * 1000,
  expect: { timeout: 40 * 1000 },
  globalTeardown:'./global-teardown.ts',
  reporter: [
    ['html'], ['allure-playwright']
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    trace: process.env.CI ? 'on-first-retry' : undefined,
  },
  projects: [
    {
      name: 'setup',
      testDir: './helpers',
      testMatch: 'auth.setup.ts',
      use: {
        browserName: 'chromium',
        headless: true,
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
});