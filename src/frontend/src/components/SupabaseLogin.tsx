import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Session } from '@supabase/supabase-js';
import GoogleButton from "./GoogleButton";
import {useNavigate} from "react-router-dom";
import {generateCookie} from "../controller/Authentication";

// some of this taken from Supabase docs: https://supabase.com/docs/guides/auth/quickstarts/react
function SupabaseLogin(){
    const navigation = useNavigate();
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        // supabase.auth.signOut();

        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)

            if (session){
                let uuid = session.user.id;
                generateCookie(uuid)

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