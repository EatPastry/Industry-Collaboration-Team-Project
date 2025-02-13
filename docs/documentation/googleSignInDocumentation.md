# Supabase Authentication Documentation

Supabase provides official authentication methods to handle user sign-up and login, including:

- **Email/Password Authentication**: A simple API to allow users to sign up and log in.
- **OAuth Providers**: Support for providers like Google.

---

## Setting Up Supabase Authentication

### Enable Authentication Methods
- Navigate to the **Authentication** section in the Supabase dashboard.
- Enable the authentication methods you want to support like email/password or google login

---

### Email/Password Authentication
Usee the provided Supabase API for user sign-up and login:
```
supabase.auth.signUp({ email, password });
supabase.auth.signInWithPassword({ email, password });
```

### Adding Google Login
1. Enable Google Login:

- In the Supabase dashboard, go to Authentication -> Providers.
- Toggle on Google and save the settings.

2. Configure Google OAuth in Google Cloud Console:

- Go to the Google Cloud Console.
- Set up a new OAuth Client ID.
- Provide a callback URL in the format:

```
https://<YOUR-SUPABASE-PROJECT-URL>/auth/v1/callback
```

3. Call Google Login to Application
```
supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

### Handling Authentication State Changes
Supabase automatically tracks authentication state changes. We can listen for these changes and update the UI as needed::
```
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});
```

## Useful Resources (read these)
- Supabase Authentication Guide:
https://supabase.com/docs/guides/auth

- Google Login Documentation:
https://supabase.com/docs/guides/auth/social-login/auth-google

- GitHub Example for Google Login with React:
https://github.com/supabase/supabase/tree/master/examples

