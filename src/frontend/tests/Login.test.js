import { test, expect } from '@playwright/test';

test('logs in successfully with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#usernameBox');
  await page.fill('#usernameBox', 'user1');

  
  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');
  
  await page.click('#loginBtn');
  
  expect(page.url()).toContain('user1');
});