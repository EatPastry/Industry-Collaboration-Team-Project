# Test-Driven Development (TDD) Table for Login Page

| **Test Case**                     | **Input**                  | **Expected Output**                | **Result** | **Issue ID** |
|-----------------------------------|----------------------------|------------------------------------|------------|--------------|
| Both username and password valid | `user1`, `password1`       | Redirect to `/user1`               | Pass/Fail  | #ID (if fail)|
| Username valid, password invalid | `user1`, `wrongPassword`   | Error message: "Invalid password." | Pass/Fail  | #ID (if fail)|
| Both invalid                     | `invalid`, `wrongPassword` | Error message: "Invalid login."    | Pass/Fail  | #ID (if fail)|
| Empty fields                     | (blank)                    | Error message: "Fields required."  | Pass/Fail  | #ID (if fail)|
