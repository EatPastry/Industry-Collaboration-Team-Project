
import React, {useState} from "react";
import { ReactComponent as HamburgerIcon } from '../assets/hamburger-icon.svg'; 
import {Link} from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
    const [open, setStateOpen] = useState<boolean>(false); 
    
    return (
        <header>
            <h1>UNiDAYS RECAPPED</h1>

            <nav className = "menu">
            <div
            className = {`Hamburger ${open ? 'Hamburger-Open' : 'Hamburger-Closed'}`} onClick = {() => setStateOpen(!open)} >
                <HamburgerIcon className="hamburger-icon"></HamburgerIcon>
            </div>

            <div className = {`Sidebar ${open? 'Sidebar-Open' : 'Sidebar-Closed'}`}> 
                <ul>
                    <li><Link to = "/home">Home</Link></li>
                    {/* Need to Make the login only appear on home page (in top right?) */}
                    <li><a href = "../pages/Recapped">My Recapped</a></li>
                    <li><a href = "../pages/Info">About</a></li>
                    <li><Link to = "/login">Login</Link></li>
                </ul>

            </div>
        </nav>


        </header>
    ); 
}

export default Header;