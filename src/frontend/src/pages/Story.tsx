import React, {useEffect, useState, useRef} from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
// import DataString from '../components/DataString';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import { ShareFileButton } from "../components/ShareButton";
import Savings from "./recappedSubPages/Savings";
import Brand from "./recappedSubPages/Brand";
import ComparativeStats from "./recappedSubPages/ComparativeStats";
import FunFacts from "./recappedSubPages/FunFacts";
import Categories from "./recappedSubPages/Categories";
import TimeBasedInsights from "./recappedSubPages/TimeBasedInsights";

/**
 * Checks every 3 seconds that the session is still active <br>
 * if the session is stale it logs the user out by clearing cookies
 *
 * @param navigation of useNavigate() to navigate to Log in (/) page
 */
export function checkSession(navigation : NavigateFunction){
    return setInterval(async () => {
      let { error} = await supabase.auth.getUser();
      if (error) {
        clearCookie(parseToken());
        navigation(`/`);
      }
    }, 3000)
  }

  

function Story() {
    let playing = true;
    let muted = false;

    const navigation = useNavigate();
    const ref = useRef();
    let numReps = 5;
    let pauseButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
    let playButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    let unmuteButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
    let muteButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
    const [transactionAmount, setTransactionAmount] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
      let [firstName, setFirstName] = useState('');
      const location = useLocation();
    
      //Recapped SubPage state Handling
      const [savings, setSavings] = useState(false);
      const [categories, setCategories] = useState(false);
      const [brand, setBrand] = useState(false);
      const [comparativeStats, setComparativeStats] = useState(false);
      const [timeBasedInsights, setTimeBasedInsights] = useState(false);
      const [funFacts, setFunFacts] = useState(false);
      useEffect(() => {
        // Log user out if without session
        const hasSession = checkSession(navigation)
    
        async function fetchUserData() {
          try {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session || !session.user) {
              return;
            }
    
    
            // fetch current users firstname from the User table
            const {data: usersName} = await supabase.from('User').select('firstName').eq('userID', session.user.id).single();
            if (usersName) {
              setFirstName(usersName.firstName?.toString());
            }
    
            // Fetch an instance of a transaction the current user has made from the Transaction table
            const {data, error} = await supabase
                .from("Transactions")
                .select("amountSpent")
                .eq("userID", session.user.id)
            if (error) {
              console.error("Error fetching transaction:", error);
              setTransactionAmount("Error fetching transaction");
            } else if (data) {
              console.log("Transaction data fetched");
              setTransactionAmount(data[0].amountSpent.toString());
            } else {
              setTransactionAmount("No transaction data found");
            }
          } catch (err) {
            console.error("Unexpected error:", err);
            setTransactionAmount("Unexpected error");
          } finally {
            setLoading(false);
          }
        }
    
        fetchUserData();
    
    
        return () => {
          clearInterval(hasSession)
        };
      }, [location.pathname, navigation]);

      const protectionError = ProtectUserRoutes(location.pathname);
        if (protectionError != null) {
          return protectionError;
        }


        

        function runStory() {
          let i = 0;

          for(i = 0; i < numReps; i++) {
            
          }
          //setFill(100);
          /*setInterval(async () => {
            fill[i] = 52
            console.log("A")
          }, 1000);*/
          
          
          
          //console.log(document.getElementsByClassName("story-bar-element"))
        }

        //const [pAnimation, setPlay] = useState({animationPlayState: playing ? "running" : "paused"})
        function StoryBars() {
            let result : React.ReactElement[] = [];
            let idString : string;
            let marginConst = 1;
            let elementWidth : Number = (100 - (marginConst * numReps-1)) / numReps;
            let delayVal = 0;
            const storyLength = 5000;
            const customAnimation = keyframes`
                from {
                  animation-timing-function: linear;
                  width: 0%;
                }

                to {
                  animation-timing-function: linear;
                  width: 100%;
                }`;
            for(let i = 0; i < numReps; i++) {
              idString = i.toString()
              if(i == numReps - 1)
                marginConst = 0;
                result.push((
                  
                  <div className='story-bar-element-container' style={{width:`${elementWidth}%`, marginRight:`${marginConst}%`}}>
                    <Reveal keyframes={customAnimation} duration={storyLength} delay={delayVal}>
                      <div className='story-bar-element' id={idString} style={{width : "100%"}}></div>
                    </Reveal>
                  </div>
                ));
              delayVal += storyLength;
            }

            return <>{result}</>
        }

        
        function PButton() {
          const [fill, setFill] = useState(pauseButton);

          function play() {
            if(playing == true) {
              playing = false;
              setFill(playButton);
              document.body.className = 'paused';
            } else {
              setFill(pauseButton);
              playing = true;
              document.body.className = '';
            }
          }
          
          return (
            <>
            <button className='story-button' id='play-button' onClick={play}>{fill}</button>
            </>
          )
        } 

        function MButton() {
          const [fill, setFill] = useState(unmuteButton);

          function mute() {
            if(muted == false) {
              muted = true;
              setFill(muteButton);
              
            } else {
              setFill(unmuteButton);
              muted = false;
            }
          }

          return (
            <>
            <button className='story-button' onClick={mute}>{fill}</button>
            </>
          )
        }

    return (
        <div className="Story">
            <div className="story-bar">
                <StoryBars/>
            </div>
            <div className="button-container">
                  <PButton/>
                  <MButton/>
            </div>
        </div>
    );
}

export default Story;