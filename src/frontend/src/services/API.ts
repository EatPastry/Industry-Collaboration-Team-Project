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

    // If the partnerID exists return it, else return null
    if (latestPartner){
        return latestPartner.partnerName
    }
    return null;
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