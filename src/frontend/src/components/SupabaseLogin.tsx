import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Session } from '@supabase/supabase-js';
import GoogleButton from "./GoogleButton";
import {useNavigate} from "react-router-dom";
import {generateCookie} from "../controller/Authentication";


async function addGoogleUserTable(email : string, firstName : string, lastName : string, uuid : string){
    const {data : data} = await supabase.from('User').select('email').eq('email', email);
    if (data && data.length === 0){
        await supabase.from('User').insert([{
            userID : uuid, firstName : firstName, lastName : lastName, email : email}]);
    }
}

// some of this taken from Supabase docs: https://supabase.com/docs/guides/auth/quickstarts/react
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

            if (session){
                const uuid = session.user.id;
                generateCookie(uuid)

                const metaData = session.user.user_metadata
                if (metaData && metaData.full_name) {
                    const splitName = metaData.full_name.split(' ');
                    const firstName = splitName[0] || '';
                    const lastName = splitName.slice(1).join(' ') || '';
                    const email = session.user.email;
                    if (email) {
                        addGoogleUserTable(email, firstName, lastName, session.user.id)
                    }
                }

                navigation(`/pages/Recapped/${uuid}`);
            }
        })

        return () => subscription.unsubscribe()
    }, [navigation])

    async function googleButtonHandler(){
        await supabase.auth.signInWithOAuth({
            provider: 'google'
        })
    }

    if (!session) {
        return <GoogleButton onClick={googleButtonHandler}></GoogleButton>
    }
    return null
}

export default SupabaseLogin;