import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Session } from '@supabase/supabase-js';
import GoogleButton from "./GoogleButton";
import {useNavigate} from "react-router-dom";
import {generateCookie} from "../services/Authentication";


/**
 * Creates a row for the User in the user table if the user doesn't yet exist in the table
 *
 * @param email is the email of the user to add
 * @param firstName is the first name of the user to add
 * @param lastName is the last name of the user to add
 * @param uuid is the userID of the user to add
 */
async function addGoogleUserTable(email : string, firstName : string, lastName : string, uuid : string){
    const {data } = await supabase.from('User').select('email').eq('email', email);
    if (data && data.length === 0){
        await supabase.from('User').insert([{
            userID : uuid, firstName : firstName, lastName : lastName, email : email}]);
    }
}

/**
 * Handler for the Google button that signs into SupaBase with OAuth
 */
async function googleButtonHandler(){
    await supabase.auth.signInWithOAuth({
        provider: 'google'
    })
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

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)

            // If the user is logged in we will add them to the table of new users (if they are new)
            if (session){
                const uuid = session.user.id;
                generateCookie(uuid)

                // Split the Google provided full name google metadata into firstname and surname components
                // So that we can add these components to the User table if the user is new
                const metaData = session.user.user_metadata
                if (metaData && metaData.full_name) {
                    const splitName = metaData.full_name.split(' ');
                    const firstName = splitName[0] || '';
                    const lastName = splitName.slice(1).join(' ') || '';
                    const email = session.user.email;
                    if (email) {
                        addGoogleUserTable(email, firstName, lastName, session.user.id);
                    }
                }

                // navigate to the users recapped page
                navigation(`/pages/Recapped/${uuid}`);
            }
        })

        return () => subscription.unsubscribe()
    }, [navigation])

    // No logged in user returns Google button
    if (!session) {
        return <GoogleButton onClick={googleButtonHandler}></GoogleButton>
    }
    return null
}

export default SupabaseLogin;