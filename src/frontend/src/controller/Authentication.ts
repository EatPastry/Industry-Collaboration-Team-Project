import { supabase} from "../utils/supabase";

let token : string =  "";


export function parseToken(): string{
    return (document.cookie.match(/loginToken=([^;]*)/)?.[1]) || "";
}

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
    token = parseToken()
    if (token !== "") {
        const urlMatch = url.match(new RegExp(token))
        return urlMatch != null;
    }else{
        return false;
    }
}


export function clearCookie(uuid : string){
    document.cookie = `loginToken=${uuid}; path=/; max-age=0;`;
}


/**
 * checks that email contains @ and password is of length 6 characters
 * @param email is th email of the account to be checked
 * @param password is the password of the account to be checked
 */
function signUpChecks(email : string, password : string){
    if (password.trim().length < 6){
        return {success : false, response : "password must be at least 6 characters"};
    }else if(!email.includes('@')){
        return {success : false, response : "email must contain a @"};
    }
    return {success : true, response : ""};
}

/**
 *Checks that entered details are valid clientSide then creates an account
 * @param email is th email of the account
 * @param password is the password of the account
 */
export async function createAccount(email : string, password : string, firstname : string, lastname : string){
    let {success, response} = signUpChecks(email, password);

    if (success){
        const {error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        response = "server error"
        return {success : !error, response};
    }else{
        return {success : false, response};
    }
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


// The token is just a mock, will need to be replaced with token from server
// I have set the token to expire in 1 minute for testing
export function generateCookie(uuid : string){
    //current user is null at this point
    document.cookie = `loginToken=${(uuid)}; path=/; max-age=60;`;
}












