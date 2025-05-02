import { supabase} from "../utils/supabase";

/**
 * Returns the string value stored in loginToken (the userID)
 */
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
    let token : string = parseToken()
    if (token !== "") {
        const urlMatch = url.match(new RegExp(token))
        return urlMatch != null;
    }else{
        return false;
    }
}

/**
 * modifies the login cookie age to 0 such that it expires and the user is logged out
 * @param uuid is the id of the user to be logged out
 */
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
 * Creates a new account <br>
 * Checks that entered details are valid <br>
 * checks that account doesn't already exist <br>
 * @param email is th email of the account
 * @param password is the password of the account
 */
export async function createAccount(email : string, password : string){
    let {success, response} = signUpChecks(email, password);
    if (!success) {
        return {success : false, response};
    }

    const {data } = await supabase.from('User').select('email').eq('email', email);
    if (data && data.length > 0){
        return {success : false, response : "Account already exists"}
    }

    const {error : signUpError} = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    return {success : !signUpError, response : "server error"};
}


/**
 *Signs in to Supabase with username and password
 *
 * @param email of the entered email
 * @param password of the entered password
 * @returns true if credentials correct, false if credentials invalid
 */
export async function signInWithPassword (email : string, password: string) {
    const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    return !error;
}


/**
 * Generates a cookie that expires in 1 hour
 * @param uuid is the userID of the user that needs a cookie
 */
export function generateCookie(uuid : string){
    document.cookie = `loginToken=${(uuid)}; path=/; max-age=3600;`;
}

