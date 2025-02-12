import { test, expect } from '@playwright/test';


// Test Case ID: 1 - Logs in successfully with valid credentials for user1@gmail.com
test('logs in successfully with valid credentials for user1@gmail.com', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1@gmail.com');


  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');

  await page.click('#actionBtn');

  await page.waitForURL('**/Recapped/*', {timeout : 5000});
  await expect(page.url()).toContain('00998bd5-74d1-4dd2-b4c3-d42c8ef73de5');

  await page.click('#signOutBtn')
  await page.waitForURL('http://localhost:3000');
});

// Test Case ID: 2 - Shows error message for invalid credentials
test('shows error message for invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'invalidUser');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'invalidPassword');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');

  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 3 - Valid username and incorrect password1
test('shows error message for valid username but incorrect password1', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1@gmail.com');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'wrongPassword');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});

// Test Case ID: 4 - Incorrect username but valid password1
test('shows error message for incorrect username but valid password1', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'wrongUser');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 5 - Logs in successfully with valid credentials for user2@gmail.com
test('logs in successfully with valid credentials for user2@gmail.com', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user2@gmail.com');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password2');

  await page.click('#actionBtn');

  await page.waitForURL('**/Recapped/*', {timeout : 5000});
  expect(page.url()).toContain('3c4d6f1c-11ff-4254-842a-c3c65eededbd');

  await page.click('#signOutBtn')
});

// Test Case ID: 6 - Empty username and password1
test('shows error message for empty username and password1', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', '');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', '');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});
// Test Case ID: 7 - Only username provided
test('shows error message for only username provided', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', 'user1@gmail.com');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', '');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});

// Test Case ID: 8 - Only password1 provided
test('shows error message for only password1 provided', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('#emailBox');
  await page.fill('#emailBox', '');

  await page.waitForSelector('#passwordBox');
  await page.fill('#passwordBox', 'password1');

  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('Invalid Credentials');
});
