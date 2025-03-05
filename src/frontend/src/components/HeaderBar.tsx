import hamburgerIcon from '../assets/hamburgerIcon.svg';
import React from 'react'
import {useState} from 'react';
import '../styles/headerBar.css'
import NavigationBar from "./NavigationBar";


/**
 *
 * @constructor
 */
function HeaderBar(){
    // Use state for closed menu = false, closed menu = true
    let [isOpen, setIsOpen] = useState(false)

    return (
        <div className={"headerBar"}>
            <img id = "hamburgerIcon"
                 className = {isOpen? "rotateRight" : "rotateLeft"}
                 alt = 'hamburgerIcon' src = {hamburgerIcon} onClick = {() => setIsOpen(!isOpen)}/>

            <h1>UNiDAYS RECAPPED</h1>

            <NavigationBar isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </div>

    );
}


export default HeaderBar