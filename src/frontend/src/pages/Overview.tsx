import React from 'react';
import Board from "../components/Board";
import Header from "../components/Header"
import { ShareFileButton } from '../components/ShareButton';
import MenuBar from "../components/MenuBar";


function Overview() {
    return (
        <>
            <div className="navBarWrapper">

                <div className="overview">
                    <br/>

                    <h1 style={{fontSize: "4rem", fontWeight: "bold", textAlign: "center"}}>
                        Your 2025 Recapped</h1>

                    <div className="overview">
                        <Board/>
                    </div>
                </div>
            </div>
        </>
    );
}



function App() {
  return (
      <ShareFileButton/>
  );
}

export default Overview;
