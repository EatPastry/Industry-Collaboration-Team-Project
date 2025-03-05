import React from 'react'
import {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";

interface barProps {
    isOpen: boolean;
    onClose : () => void;
}

function NavigationBar({isOpen, onClose}: barProps) {
    return (
        <>
            <div className = {`navigationBar ${isOpen ? 'open' : 'closed'}`}>
                {isOpen &&
                    <div className="navigationContent">
                        <h2> The Menu </h2>
                        <button onClick={() => onClose()}>Close</button>

                     </div>
                }
            </div>

            {/*Darkens the background when the menu is open*/}
            {isOpen && <div className={'darkenBackground'} onClick = {onClose} />}
        </>
    );
}


export default NavigationBar