import hamburgerIcon from '../assets/hamburgerIcon.svg';
import React from 'react'
import {useState, useEffect} from 'react';
import '../styles/menuBar.css'
import NavigationBar from "./NavigationBar";
import {Outlet} from "react-router-dom";

/**
 * Creates a MenuBar with the 'UNiDAYS title' and a Hamburger Icon
 * <br>
 * Returns Navigation bar when the hamburger Icon is pressed
 */
function MenuBar(){
    // Use state for closed menu = false, closed menu = true
    let [isOpen, setIsOpen] = useState(false)
    let [isMobile, setIsMobile] = useState(false);

    function close (){
        setIsOpen(false);
    }

    useEffect(() => {
        /*
        Watch the width of the screen. if it is reduced past a 600px then we set isMobile to true.
        This ensures that when the navigation bar slides into the screen on mobile it is behind (in terms of z index)
        the menuBar.
         */
        const watchWidth = window.matchMedia('(max-width: 600px)')
        setIsMobile(watchWidth.matches)

        // Add a listener to the mediaQuery so that it updates without refresh
        const watchWidthHandler = (event : MediaQueryListEvent) => setIsMobile(event.matches)
        watchWidth.addEventListener('change', watchWidthHandler);
        return () => watchWidth.removeEventListener('change', watchWidthHandler)
    }, []);

    return (
        <>
        <div className="navBarWrapper">
        <div className={"menuBar"}>
            {/*set is open to !isOpen when the hamburger Icon is pressed, css class is based off of this*/}
            <img id = "hamburgerIcon"
                 className = {isOpen? "rotateRight" : "rotateLeft"}
                 alt = 'hamburgerIcon' src = {hamburgerIcon} onClick = {() => setIsOpen(!isOpen)}/>

            <div id = "barTitle">
                <img
                    width="100px"
                    alt="UNiDAYS"
                    src="https://assets1.unidays.world/v5/main/assets/images/logo_v003.svg"
                    />

            </div>

            {/*If we are not on mobile then NavigationBar exists as a child of MenuBar*/}
            {!isMobile && <NavigationBar isOpen={isOpen} onClose = {close}/>}
        </div>
            {/*If we are not on mobile then NavigationBar exists outside MenuBar */}
            {isMobile && <NavigationBar isOpen={isOpen} onClose = {close}/>}
        </div>
        {/*Required such that MenuBar can be rendered as part of the REACT ROUTER DOM*/}
        <Outlet/>
        </>
    );
}


export default MenuBar