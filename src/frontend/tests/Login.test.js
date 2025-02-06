import { test, expect } from '@playwright/test';

// Test Case ID: 1 - Logs in successfully with valid credentials for user1
test('logs in successfully with valid credentials for user1', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1');

  
  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');
  
  await page.click('#actionBtn');
  
  expect(page.url()).toContain('user1');
});

// Test Case ID: 2 - Shows error message for invalid credentials
test('shows error message for invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'invalidUser');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'invalidPassword');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 3 - Valid username and incorrect password
test('shows error message for valid username but incorrect password', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'wrongPassword');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});

// Test Case ID: 4 - Incorrect username but valid password
test('shows error message for incorrect username but valid password', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'wrongUser');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 5 - Logs in successfully with valid credentials for user2
test('logs in successfully with valid credentials for user2', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user2');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password2');
  
  await page.click('#actionBtn');
  
  expect(page.url()).toContain('user2');
});

// Test Case ID: 6 - Empty username and password
test('shows error message for empty username and password', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', '');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', '');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 7 - Only username provided
test('shows error message for only username provided', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', '');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});

// Test Case ID: 8 - Only password provided
test('shows error message for only password provided', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', '');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');
  
  await page.click('#actionBtn');
  
  await page.waitForSelector('#loginResponse');
  const responseText = await page.textContent('#loginResponse');
  expect(responseText).toBe('Invalid Credentials');
});
