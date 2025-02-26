import { test, expect } from '@playwright/test';

// Test Case 1: First Name must be filled in
// Expected: Displays "First Name Required"
test('shows error message when first name is empty', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('#switchBtn'); // Click create account button
  await page.click('#actionBtn'); // Click next without entering first name

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toBe('First Name Required');
});

// Test Case 2: Email must contain @
// Expected: Displays appropriate error message
// (Adjust expectation based on actual error message)
test('shows error message for invalid email format', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('#switchBtn');
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.click('#actionBtn');

  await page.fill('#signup-email', 'invalidEmail');
  await page.fill('#signup-password', 'validPassword1');
  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toContain('email must contain a @');
});

// Test Case 3: Password must be at least 6 characters
// Expected: Displays appropriate error message
test('shows error message for short password', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('#switchBtn');
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.click('#actionBtn');

  await page.fill('#signup-email', 'valid@email.com');
  await page.fill('#signup-password', '123'); // Too short
  await page.click('#actionBtn');

  await page.waitForSelector('#userResponse:not(:empty)');
  const responseText = await page.textContent('#userResponse');
  expect(responseText).toContain('password must be at least 6 characters');
});

// Test Case 4: Account already exists
test('shows error when account already exists', async ({ page }) => {
    await page.goto('http://localhost:3000');
  
    await page.click('#switchBtn');
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.click('#actionBtn');
  
    await page.fill('#signup-email', 'existinguser@email.com');
    await page.fill('#signup-password', 'validPassword1');
    await page.click('#actionBtn');
  
    await page.waitForSelector('#userResponse:not(:empty)');
    const responseText = await page.textContent('#userResponse');
    expect(responseText).toBe('Account already exists');
});

// Test Case 5: Simulate server error by forcing failure
test('shows server error for unexpected issues', async ({ page }) => {
    await page.goto('http://localhost:3000');
  
    await page.click('#switchBtn');
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.click('#actionBtn');
  
    // Intercept Supabase's signup request to simulate a server error
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' }),
      });
    });
  
    await page.fill('#signup-email', `servererror${Date.now()}@email.com`); // Unique email
    await page.fill('#signup-password', 'validPassword1');
    await page.click('#actionBtn');
  
    // Ensure we wait for the UI to show an error message
    await page.waitForSelector('#userResponse:not(:empty)');
    const responseText = await page.textContent('#userResponse');
  
    // Check if the error message is shown
    expect(responseText.toLowerCase()).toContain('server error');
});