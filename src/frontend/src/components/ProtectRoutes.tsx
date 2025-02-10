import React from "react";
import {Navigate} from "react-router-dom";
import "../controller/Authentication.ts";
import {isAuthenticated, isUserSpecific} from "../controller/Authentication";
import {supabase} from "../utils/supabase";

interface ProtectRoutesProps{
    children: JSX.Element;
}

/**
 * Checks if authenticated for general case
 *
 * @param children the page to navigate to
 * @returns the page to navigate to if cookie exists, else returns the login page "/"
 */
function ProtectRoutes({children} : ProtectRoutesProps){
    if (!isAuthenticated()){
        return <Navigate to = "/"/>
    }
    return children;
}

/**
 * Checks if authenticated for specific user
 *
 * @param url of the url to pattern match on
 * @returns the login page if they do not match, else returns null
 */
export function ProtectUserRoutes(url : string){
    if (!isUserSpecific(url)){
        supabase.auth.signOut();
        return <Navigate to = "/"/>
    }
    return null;
}

export default ProtectRoutes;