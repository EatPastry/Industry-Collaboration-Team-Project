# TDD Table for Login Functionality

| **Test Case ID** | **Scenario**                                      | **Input**                 | **Expected Output**                                          | **Actual Output**          | **Issue ID** |
|-------------------|--------------------------------------------------|---------------------------|-------------------------------------------------------------|-----------------------------|--------------|
| 1                 | Both username and password are correct           | username: `user1`         | Redirect to `/user1` with the correct URL path              |                             |              |
|                   |                                                  | password: `password1`     |                                                             |                             |              |
| 2                 | Username correct, password incorrect             | username: `user1`         | Display error message: "Invalid username or password."      |                             |              |
|                   |                                                  | password: `wrongpassword` |                                                             |                             |              |
| 3                 | Username incorrect, password correct             | username: `wronguser`     | Display error message: "Invalid username or password."      |                             |              |
|                   |                                                  | password: `password1`     |                                                             |                             |              |
| 4                 | Both username and password are incorrect         | username: `wronguser`     | Display error message: "Invalid username or password."      |                             |              |
|                   |                                                  | password: `wrongpassword` |                                                             |                             |              |
| 5                 | Empty username and password                      | username: `(empty)`       | Display error message: "Please enter both username and password." |                       |              |
|                   |                                                  | password: `(empty)`       |                                                             |                             |              |
| 6                 | Ensure URL changes correctly upon successful login | username: `user2`         | URL updates to `/user2`                                     |                             |              |
|                   |                                                  | password: `password2`     |                                                             |                             |              |
| 7                 | User attempts to submit without any interaction  | username: `(empty)`       | Display error message: "Please enter both username and password." |                       |              |
|                   |                                                  | password: `(empty)`       |                                                             |                             |              |

## Notes
- Fill in the **Actual Output** column after performing tests.
- If there is a mismatch between **Expected Output** and **Actual Output**, create an issue in your issue tracker and reference the **Issue ID** in the table.
- Update the table as issues are resolved and new test cases are identified.
