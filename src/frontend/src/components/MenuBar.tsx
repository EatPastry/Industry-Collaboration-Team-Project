import hamburgerIcon from '../assets/hamburgerIcon.svg';
import React from 'react'
import {useState} from 'react';
import '../styles/menuBar.css'
import NavigationBar from "./NavigationBar";


/**
 *
 * @constructor
 */
function MenuBar(){
    // Use state for closed menu = false, closed menu = true
    let [isOpen, setIsOpen] = useState(false)

    return (
        <div className={"headerBar"}>
            <img id = "hamburgerIcon"
                 className = {isOpen? "rotateRight" : "rotateLeft"}
                 alt = 'hamburgerIcon' src = {hamburgerIcon} onClick = {() => setIsOpen(!isOpen)}/>

            <h1>UNiDAYS RECAPPED</h1>

            <NavigationBar isOpen={isOpen}/>
        </div>

    );
}


export default MenuBar