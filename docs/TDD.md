| Test Case ID | Test Description                                         | Expected Outcome                        | Issue ID (if fails) |
|--------------|----------------------------------------------------------|-----------------------------------------|---------------------|
| 1            | Logs in successfully with valid credentials for user1    | URL contains 'user1'                    |                     |
| 2            | Shows error message for invalid credentials              | Displays "Invalid Credentials"          |                     |
| 3            | Correct username but incorrect password                  | Displays "Invalid Credentials"          |                     |
| 4            | Incorrect username but correct password                  | Displays "Invalid Credentials"          |                     |
| 5            | Logs in successfully with valid credentials for user2    | URL contains 'user2'                    |                     |
