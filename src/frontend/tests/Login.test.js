import { test, expect } from '@playwright/test';

// Test Case ID: 1 - Both username and password are correct
test('logs in successfully with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#usernameBox');
  await page.fill('#usernameBox', 'user1');

  
  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');
  
  await page.click('#loginBtn');
  
  expect(page.url()).toContain('user1');
});

// Test Case ID: 2 - Incorrect username and password
test('shows error message for invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#usernameBox');
  await page.fill('#usernameBox', 'invalidUser');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'invalidPassword');
  
  await page.click('#loginBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});