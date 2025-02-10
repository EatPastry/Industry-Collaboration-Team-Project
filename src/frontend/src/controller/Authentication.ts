import { supabase} from "../utils/supabase";

let token : string =  "";

/**
 * Uses a regex to see if a loginToken has been set
 * @returns true if there is a loginToken, else returns false
 */
export function isAuthenticated(): Boolean{
    return document.cookie.match(new RegExp('loginToken=')) != null;
}

/**
 * Uses a regex to see if a loginToken has been set
 * @returns true if there is a loginToken and if the token matches the url of the session, else returns false
 */
export function isUserSpecific(url : string): Boolean{
    token = (document.cookie.match(/loginToken=([^;]*)/)?.[1]) || "";
    if (token !== "") {
        const urlMatch = url.match(new RegExp(token))
        return urlMatch != null;
    }else{
        return false;
    }
}


export function changeCookie(username : string){
    document.cookie = `loginToken=${username}; path=/; max-age=0;`;
}

/**
 *Creates an account
 * @param email is th email of the account
 * @param password is the password of the account
 */

export async function createAccount(email : string, password : string, firstname : string, lastname : string){
    const {error} = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    return !error;
}


/**
 *Validates username and password using Supabase
 *
 * @param email of the entered email
 * @param password of the entered password
 * @returns true if credentials correct, false if credentials invalid
 */
export async function validateLogin (email : string, password: string) {
    const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    return !error;
}

/**
 * Creates a token if the credentials are valid
 * This is not secure, All tokens are the same. After Proof of concept we will need to generate tokens using supabase
 *
 * @param username the entered username
 * @param password the entered password
 * @returns true if the credentials are valid, else false
 */
export async function authenticateLogin(username : string, password : string) {
    if (await validateLogin(username, password)){
        generateCoookie(username)
        return true
    }else{
        return false
    }
}


// The token is just a mock, will need to be replaced with token from server
// I have set the token to expire in 1 minute for testing
export function generateCoookie(username : string){
    document.cookie = `loginToken=${username}; path=/; max-age=60;`;
}












