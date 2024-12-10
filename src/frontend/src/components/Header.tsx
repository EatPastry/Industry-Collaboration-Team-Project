import React from "react";
import '../styles/header.css'

/**
 * Creates and the header component
 * @returns the header component
 */
function Header () {
    return (
        <header>
            <div>
                <img width="150px" src="https://assets1.unidays.world/v5/main/assets/images/logo_v003.svg">
                </img><h1> RECAPPED</h1>
            </div>
        </header>
    ); 
}


export default Header;