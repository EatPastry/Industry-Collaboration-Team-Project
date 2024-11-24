# Frontend TDD

Contains our tests for the frontend...

## Login Test Table

| Test Case ID | Test Description                                             | **Inputs**                                      | Expected Outputs               | **Pass/Fail (w/ date)** | Issue ID (if fails) | **Changes Made** |
| ------------ | ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------ | ----------------------- | ------------------- | ---------------- |
| 1            | Logs in successfully with valid credentials for user1        | username of 'user1' and password of 'password1' | URL contains 'user1'           | PASS (2024-11-23)       |                     |                  |
| 2            | Shows error message for invalid credentials                  | invalid username and invalid password           | Displays "Invalid Credentials" | PASS (2024-11-23)       |                     |                  |
| 3            | Shows error message for valid username but incorrect password | Valid username. invalid password.               | Displays "Invalid Credentials" | PASS (2024-11-23)       |                     |                  |
| 4            | Shows error message for incorrect username but valid password | Invalid username. Valid password.               | Displays "Invalid Credentials" | PASS (2024-11-23)       |                     |                  |
| 5            | Logs in successfully with valid credentials for user2        | username of 'user2' and password of 'password2' | URL contains 'user2'           | PASS (2024-11-23)       |                     |                  |
| 6            | Shows error message for Empty username and password          | No arguments for username or password.          | Displays "Invalid Credentials" | FAIL (2024-11-23)       |                     |                  |
| 7            | Shows error message for only username provided               | Valid username. No password argument.           | Displays "Invalid Credentials" | PASS (2024-11-23)       |                     |                  |
| 8            | Shows error message for only password provided               | No username argument. Valid password.           | Displays "Invalid Credentials" | PASS (2024-11-23)       |                     |                  |
