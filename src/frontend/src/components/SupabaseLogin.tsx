import React, { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js';
import GoogleButton from "./GoogleButton";
import {useNavigate} from "react-router-dom";
import {generateCookie} from "../services/Authentication";
import {addGoogleUser, getSession, getUUID, googleOAuthSignIn, hasTransaction} from "../services/API";

/**
 * Handler for the Google button that signs into SupaBase with OAuth
 */
async function googleButtonHandler(){
    await googleOAuthSignIn()
}

/**
 * Establishes a Session for a User if a session for that user doesn't already exist
 * Calls addGoogleUserTable if the account is from Google
 *If the user has a session Navigates to their recapped page else returns {@link GoogleButton}
 *
 * Session setUp follows : https://supabase.com/docs/guides/auth/quickstarts/react
 */
function SupabaseLogin(){
    const navigation = useNavigate();
    const [session, setSession] = useState<Session | null>(null)

    async function userSessionHandler(session : Session | null){
        // If the user is logged in we will add them to the table of new users (if they are new)
        if (session) {
            const uuid = session.user.id;
            generateCookie(uuid)

            // Split the Google provided full name google metadata into firstname and surname components
            // So that we can add these components to the User table if the user is new
            const metaData = session.user.user_metadata
            if (metaData && metaData.full_name) {
                const splitName = metaData.full_name.split(' ');
                const firstName = splitName[0] || '';
                const lastName = splitName.slice(1).join(' ') || '';
                await addGoogleUser(firstName, lastName);
            }
        }

        //check this
        // Check if the current user has a transaction
        const hasTransactions = await hasTransaction();
        const uuid = await getUUID();
        if (hasTransactions) {
            // navigate to the users recapped page if transaction exists
            navigation(`/pages/Recapped/${uuid}`);
        } else {
            // navigate to the users transaction hub if no transaction exists
            navigation(`/pages/transactionHub/${uuid}`);
        }
    }


    useEffect(() => {
        async function sessionHandler() {
            let newSession = await getSession()

            if (!newSession) {
                return;
            }

            setSession(newSession)
            userSessionHandler(newSession);
        }

        sessionHandler()
    }, [navigation])

    // Return the Google button
    return <GoogleButton onClick={googleButtonHandler}></GoogleButton>

}

export default SupabaseLogin;