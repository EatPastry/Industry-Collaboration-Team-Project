describe('Simple Test Suite', () => {
  test('adds two numbers correctly', () => {
    const sum = 1 + 2;
    expect(sum).toBe(3);
  });

  test('checks a string is not empty', () => {
    const message = 'Hello, World!';
    expect(message).not.toBe('');
  });

  test('checks if an object contains a property', () => {
    const user = { username: 'user1', password: 'password1' };
    expect(user).toHaveProperty('username', 'user1');
  });
});
