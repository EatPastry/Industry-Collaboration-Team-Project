
let token : string = '';

/**
 * Uses a regex to see if a loginToken has been set
 * @returns true if there is a loginToken, else returns false
 */
export function isAuthenticated(): Boolean{
    const tokenMatch = document.cookie.match(new RegExp('loginToken=' + token));
    return tokenMatch != null;
}

/**
 * Uses a regex to see if a loginToken has been set
 * @returns true if there is a loginToken and if the token matches the url of the session, else returns false
 */
export function isUserSpecific(url : string): Boolean{
    const tokenMatch = document.cookie.match(new RegExp('loginToken=' + token));
    const urlMatch = url.match(new RegExp(token))

    return tokenMatch != null && urlMatch != null;
}


/**
 *Validates username and password inputs by comparing to hardcoded 'user1', 'user2' usernames and passwords
 *
 * @param username of the entered username
 * @param password of the entered password
 * @returns true if credentials correct, false if credentials invalid
 */
export function validateLogin (username : string, password: string) {
    // will need to modify this later to validate using db
    let validCredentials : string [][] = [['user1', 'password1'],['user2', 'password2']];

    return (username === validCredentials[0][0] && password === validCredentials[0][1])
        || (username === validCredentials[1][0] && password === validCredentials[1][1]);
}

/**
 * Creates a token if the credentials are valid
 * This is not secure, All tokens are the same. After Proof of concept we will need to generate tokens using supabase
 *
 * @param username the entered username
 * @param password the entered password
 * @returns true if the credentials are valid, else false
 */
export function authenticateLogin(username : string, password : string) {
    if (validateLogin(username, password)){
        // The token is just a mock, will need to be replaced with token from server
        // I have set the token to expire in 10 seconds for testing purposes
        token = username
        document.cookie = `loginToken=${token}; path=/; max-age=5;`;
        return true   
    }else{
        return false
    }
}



