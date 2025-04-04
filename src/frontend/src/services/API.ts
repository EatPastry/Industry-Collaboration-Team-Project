import {supabase} from "../utils/supabase";


/**
 * Returns all transactions for the current User
 */
export async function getCurrentUserTransactions(){
    // get the session for the current logged-in user
    const session = await getSession();
    if (!session){
        return null;
    }
    // Assign userID variable for transaction search
    const userID = session.user.id;

    // Pull all transactions associated with a given user
    const {data: userTransactions} = await supabase
        .from("Transactions")
        .select("*")
        .eq("userID", userID)

    // Error check transaction pull
    if (userTransactions == null) {
        console.error("Error fetching user transactions");
        return null;
    }

    return userTransactions
}

// Takes a PartnerID and returns PartnerID, and ShopCategory from the Partner table for that given Partner ID
export async function getPartnerIds(partnerID : (string | number)[]) : Promise<any | null>{
    // Pull the partnerData for each partnerID
    const { data: partnerData, error: partnerError } = await supabase
        .from("Partner")
        .select("partnerID, shopCategory, partnerName")
        .in("partnerID", partnerID);

    // Error check the partnerData
    if (partnerError) {
        console.error("Error fetching partner categories:", partnerError?.message);
        return null;
    }

    return partnerData
}


/**
 * Returns the partnerName for a given partnerID
 * @param partnerID of the partnerName to be returned
 */
export async function getSinglePartnerName(partnerID : string){
    // Fetch a single instance of the partner Name for the given partner ID
    const {data : latestPartner} =
        await supabase.from("Partner")
            .select("partnerName")
            .eq("partnerID", partnerID).single()

    // If the partnerID exists return their partner Name, else return null
    if (latestPartner){
        return latestPartner.partnerName
    }
    return null;
}


/**
 * Returns the partner ID for a given partner Name
 * @param partnerName
 */
export async function pNameToID(partnerName : string){
    const {data : partner} =
        await supabase.from("Partner")
            .select("partnerID")
            .eq("partnerName", partnerName).single()

    // If the partnerID exists return it, else return null
    if (partner){
        return partner.partnerID
    }
    return null;
}


// Returns the partnerID and names for all the partners in the Partner table
export async function getAllPartners(){
    const { data, error } = await supabase
        .from('Partner')
        .select('partnerID, partnerName');

    if (error){
        throw error;
    }else{
        return data;
    }
}


/**
 * returns the session for the current logged-in user
 */
export async function getSession(){
    const {data: {session}} = await supabase.auth.getSession();

    // If no session exists return null, else return the session
    if (!session || !session.user) {
        return null;
    }
    return session;
}

/**
 * returns Every transaction for every User
 */
export async function getEveryUsersTransactions(){
    const {data : allTransactions} = await supabase
        .from('Transactions')
        .select('userID, partnerID, amountSpent, discountPercentage')

    // If no Transactions exist then return null, else return the transactions
    if (allTransactions === null) {
        return null
    }

    return allTransactions
}


/**
 * Returns the last name of the current logged-in user
 */
export async function addTransaction(partnerID : string, amountSpent : number, discountPercentage : number) {
    // Get the current signed-in user from the session
    const session = await getSession();
    if (!session) {
        console.error("No current signed in User");
        return null;
    }

    // Add the data to the transaction table
    const {data, error} = await supabase.from("Transactions")
        .insert([{
            userID: session.user.id,
            partnerID: partnerID,
            amountSpent: amountSpent,
            discountPercentage: discountPercentage,
            transactionTimestamp: new Date().toISOString()
        }])
    if (error) {
        console.error("Error adding transaction.");
        return null;
    } else {
        console.log("Transaction added.");
        return true;
    }
}

/**
 * Adds an object of transactions to the Transactions table
 */
export async function addManyTransactions(transactions: { userID: string | null; partnerID: string; amountSpent:
        number; discountPercentage: number; transactionTimestamp: string; }[]){
    const {error} = await supabase.from('Transactions').insert(transactions)

    if (error){
        console.error(error)
        return;
    }
}

/**
 * Returns the first name of the current logged-in user
 */
export async function getFirstName(){
    let session = await getSession();
    if (!session){
        return null;
    }
    // fetch the username using the userid for the current logged-in user
    const {data: firstname} = await supabase.from('User').select('firstName').eq('userID', session.user.id).single();
    if (firstname){
        return firstname.firstName?.toString()
    }
    return null
}

/**
 * Returns the last name of the current logged-in user
 */
export async function getLastName(){
    let session = await getSession();
    if (!session){
        return null;
    }
    // fetch the username using the userid for the current logged-in user
    const {data: lastName} = await supabase.from('User').select('lastName').eq('userID', session.user.id).single();
    if (lastName){
        return lastName.lastName?.toString()
    }
    return null
}

/**
 * Returns the full name the current logged-in user
 */
export async function getFullName(){
    let firstName = await getFirstName();
    let lastName = await getLastName();
    if (!lastName){
        lastName = ""
    }

    if (firstName){
        return firstName.concat(" ", lastName);
    }
    return null;
}



/**
 * returns the profile picture of the current logged-in user
 */
export async function getProfilePicture(){
    let session = await getSession();
    if (!session){
        return null;
    }


   const userMetaData = session.user.user_metadata;

    if (userMetaData){
        return userMetaData.avatar_url || userMetaData.user_avatar || userMetaData.picture;
    }

    return null;
}

/**
 * returns true/false if the current logged-in user has made transactions
 */
export async function hasTransaction() {
    // Get the session for the current logged-in user
    let session = await getSession();
    if (!session) {
        return null;
    }

    // Gets a single transaction from the current logged-in user
    const {data} = await supabase
        .from('Transactions')
        .select('userID')
        .eq('userID', session.user.id)
        .limit(1);

    // returns true if there exists a transaction
    return !!(data && data.length > 0);
}

/**
 * Signs out the current logged-in user from their session
 */
export async function signUserOut(){
    await supabase.auth.signOut();
}




/**
 * Creates a row for the User in the user table if the user doesn't yet exist in the table
 *
 * @param firstName is the first name of the user to add
 * @param lastName is the last name of the user to add
 */
export async function addGoogleUserTable(firstName : string, lastName : string){
    const session = await getSession()

    if (!session){
        return;
    }

    const email = session.user.email;

    const {data } = await supabase.from('User').select('email').eq('email', email);
    if (data && data.length === 0){
        await addUser(firstName, lastName)
    }
}


/**
 * Creates a row for the User in the user table
 *
 * @param firstName is the first name of the user to add
 * @param lastName is the last name of the user to add
 */
export async function addUser(firstName : string, lastName : string) {
    const session = await getSession();

    if (!session){
        return false;
    }

    const email = session.user.email;

    await supabase.from('User').insert([{
        userID : session.user.id, firstName : firstName, lastName : lastName, email : email}]);

    return true;
}



/**
 * Starts the sign in the Google process using SupaBases Oauth
 * The User is then taken to the Google sign in page
 */
export async function googleOAuthSignIn(){
    await supabase.auth.signInWithOAuth({
        provider: 'google'
    })
}

/**
 * returns the UUID userID for the current signed-in user
 */
export async function getUUID(){
    const session = await getSession();
    if (!session){
        return null;
    }
    return session.user.id;
}

/**
 * Checks if there is a current signed-in user
 * if no user then returns error, else returns null
 */
export async function doesUserExist(){
    let { error} = await supabase.auth.getUser();
    if (error){
        return error;
    }
    return null;
}