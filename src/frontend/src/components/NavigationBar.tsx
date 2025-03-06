import React, {useEffect, useState} from 'react'
import '../styles/navigationBar.css'
import blankProfile from '../assets/blankProfile.jpg'
import {getFullName, getProfilePicture} from "../services/API";
import {clearCookie, parseToken} from "../services/Authentication";
import {supabase} from "../utils/supabase";
import {NavigateFunction, useNavigate} from "react-router-dom";

interface barProps {
    isOpen: boolean;
    onClose?: () => void;
}

function NavigationBar({isOpen, onClose}: barProps) {
    const navigation = useNavigate();
    const [fullName, setFullName] = useState("")
    const [profilePicture, setProfilePicture] = useState(blankProfile);

    useEffect(() => {
        async function fetchFullName(){
            let name = await getFullName();
            if (name){
                setFullName(name);
            }
        }

        fetchFullName()


        async function getProfileImage() {
            const image = await getProfilePicture();

            if (image) {
                setProfilePicture(image);
            }
        }

        getProfileImage()

    }, []);


    useEffect(() => {
        if (isOpen){
            document.body.classList.add("filler");
        }else{
            document.body.classList.remove("filler");
        }

        return () => {
            document.body.classList.remove("filler");
        }

    }, [isOpen]);

    /**
     * Handles user sign out. <br>
     * Closes Session and Clears User cookies
     *
     * @param navigation of useNavigate() to navigate to Log in (/) page
     */
    async function signOut(navigation : NavigateFunction){
        clearCookie(parseToken());
        await supabase.auth.signOut();
        navigation(`/`);
    }

    return (
        <>
            <div className = {`navigationBar ${isOpen ? 'open' : ''}`}>
                {
                    <div className="navigationContent">
                        <div id="profileDetails">

                            <img src={profilePicture} alt="Profile Picture"
                                 width="50" height="50"
                                 style={{
                                     borderRadius: "50%",
                                     border: "2px solid black",
                                     objectFit: "cover",
                                 }
                                 }
                            />

                            <h2 id="fullName">{fullName}</h2>
                        </div>

                        <button id="signOutBtn" onClick={() => signOut(navigation)}>sign out</button>

                    </div>
                }
            </div>
            {isOpen && <div id="mobileBackground" onClick = {onClose}></div>}
        </>
    );
}

export default NavigationBar