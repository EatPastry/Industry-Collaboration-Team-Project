import React, {useEffect, useState} from 'react'
import '../styles/navigationBar.css'
import blankProfile from '../assets/blankProfile.jpg'
import {getFullName, getProfilePicture, getSession} from "../services/API";
import {clearCookie, parseToken} from "../services/Authentication";
import {supabase} from "../utils/supabase";
import {NavigateFunction, useNavigate} from "react-router-dom";

interface barProps {
    isOpen: boolean; // The sidebar is visible when isOpen is true
    onClose?: () => void;
}

/**
 * Adds a Navigation Bar (sidebar) for navigation and log out functionality
 *
 * @param isOpen if the navBar is open or closed (hamburger has been pressed)
 * @param onClose Handles closing the sidebar if the background is clicked
 */
function NavigationBar({isOpen, onClose}: barProps) {
    const navigation = useNavigate();
    const [fullName, setFullName] = useState("")
    // Set the initial profile picture src to blankProfile.jpg
    const [profilePicture, setProfilePicture] = useState(blankProfile);

    async function navigateToPage(page : string){
        // fetch the session for the current user
        const session = await getSession();

        if (!session){
            return;
        }

        if (window.innerWidth <= 600 && onClose){
            onClose();
        }

        navigation(`pages/${page}/${session.user.id}`);
    }


    // User credentials fetched on the initial render only
    useEffect(() => {
        // Fetches the full Name of the current logged-in user using API.ts
        async function fetchFullName(){
            let name = await getFullName();
            if (name){
                setFullName(name);
            }
        }

        fetchFullName()

        // fetches the profile picture URL of the current logged-in user using API.ts
        async function getProfileImage() {
            const image = await getProfilePicture();

            if (image) {
                setProfilePicture(image);
            }
        }

        getProfileImage()

    }, []);

    // called for every update of isOpen
    useEffect(() => {
        if (isOpen){
            // Adds a filler margin to the left of the page (such that page components shift right 300px)
            document.body.classList.add("filler");
        }else{
            // Removes the filler margin when isOpen is set to false (it is closed)
            document.body.classList.remove("filler");
        }

        // Remove the filler when the NavigationBar dismounts
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
            {/*variable classname to apply different styles when open or closed. see navigationBar.css */}
            <div className = {`navigationBar ${isOpen ? 'open' : ''}`}>
                {
                    <div className="navigationContent">
                        {/*Add styling to the current users details such that it sits in a row instead of a column */}
                        <div id="profileDetails">

                            {/*Add the profile picture. blankProfile if none exists */}
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

                        <br/>
                        <button className='navBarButton' onClick={() => navigateToPage("Recapped")}>Recapped</button>
                        
                        <button className='navBarButton' onClick={() => navigateToPage("Story")}>Recapped Story</button>
                        
                        <button className='navBarButton' onClick={() => navigateToPage("TransactionHub")}>Transaction Hub</button>
                        
                        {/*Call signOut when the sign-out button is pressed */}
                        <button className='navBarButton' id="signOutBtn" onClick={() => signOut(navigation)}>Sign Out</button>

                    </div>
                }
            </div>
            {/*The mobile (grey) background is only added when the menu is Open*/}
            {isOpen && <div id="mobileBackground" onClick = {onClose}></div>}
        </>
    );
}

export default NavigationBar