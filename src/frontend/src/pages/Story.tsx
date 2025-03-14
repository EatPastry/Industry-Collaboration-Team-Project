import React, {useEffect, useState, useRef, ReactElement, useSyncExternalStore} from 'react';
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
import ReactDOM from 'react-dom';
import { start } from 'repl';

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

const barAnimation = keyframes`
from {
  width: 0%;
  animation-timing-function: linear;
  border-radius: 16px;
}
to {
  width: 100%;
  animation-timing-function: linear;
  border-radius: 16px;
}
`;
let playing = true;
let currStoryTime = 0;

function Story() {

  const [currentPage, setCurrentPage] = useState(0);
  //const [transactionAmount, setTransactionAmount] = useState<string | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [firstName, setFirstName] = useState('');
    
    let muted = false;
    let pauseTime = 0;
    let time = new Date()
      // slides for story
  const pages = [
    <Savings />,
    <Categories />,
    <Brand />,
    <ComparativeStats />,
    <TimeBasedInsights />,
    <FunFacts />
  ];

    const numReps = pages.length;
    const storyLength = 5000;

    const navigation = useNavigate();
    const location = useLocation();

  useEffect(() => {
    const hasSession = checkSession(navigation);
    return () => {
      clearInterval(hasSession);
    };
  }, [navigation]);

  useEffect(() => {
    
    let incr = true;

    waitPlay();

    /**
     * Recursively calls itself depending on the result from checkState()
     */
    async function waitPlay() {
      const result = await checkState();
      if(result == 2) {
        waitPlay();
      } else if(result == 1){
        waitPlay();
      } else {
        while(true) {
          const waitResult = await checkState();
          if(result == 2) {
            waitPlay();
            break;
          } else if(result == 1){
            goRight();
            waitPlay();
            break;
          }
       }
        
      }
      
    }

    /**
    * Checks every 250ms the state of the story (playing, paused, total time until next slide)
    *@returns an integer result which corresponds to the story state.
    */
    function checkState() {
      return new Promise((resolve) => {
        setTimeout(() => {
          if(incr) currStoryTime+=0.25;
          if(playing && currStoryTime == storyLength / 1000) {
            currStoryTime = 0;
            resolve(1);
            goRight();
          } else if(playing) {
            resolve(2);
            incr = true;
          } else {
            resolve(3);
            incr = false;
          }
        }, 250);
      });

    }
    
  }, []);

  // For arrow-key navigation on desktop
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        goLeft();
      } else if (e.key === 'ArrowRight') {
        goRight();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

    const protectionError = ProtectUserRoutes(location.pathname);
    if (protectionError != null) {
      return protectionError;
    }

    
    let pauseButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
    let playButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    let unmuteButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
    let muteButton = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
    runStory();
    
    function runStory() {
          //setFill(100);
          
          
          
      
          //console.log(document.getElementsByClassName("story-bar-element"))
        }

        //const [pAnimation, setPlay] = useState({animationPlayState: playing ? "running" : "paused"})
        
        function StoryBars() {

          return (
            <>
              {Array.from({ length: numReps }, (_, i) => {
                let barState: 'behind' | 'current' | 'ahead' = 'ahead';
                if (i < currentPage) barState = 'behind';
                else if (i === currentPage) barState = 'current';

                if (barState === 'behind') {
                  return (
                    <div
                      key={i}
                      className="story-bar-element-container"
                      style={{
                        width: `${100 / numReps - 1}%`,
                        marginRight: i < numReps - 1 ? '1%' : '0',
                        backgroundColor: 'gray',
                        borderRadius: '16px',
                        height: '5px'
                      }}
                    >
                      <div
                        className="story-bar-element"
                        style={{ width: '100%', backgroundColor: 'white', height: '5px' }}
                      />
                    </div>
                  );
                } else if (barState === 'current') {
                  return (
                    <div
                      key={i}
                      className="story-bar-element-container"
                      style={{
                        width: `${100 / numReps - 1}%`,
                        marginRight: i < numReps - 1 ? '1%' : '0',
                        backgroundColor: 'gray',
                        borderRadius: '16px',
                        height: '5px'
                      }}
                    >
                      <Reveal
                        keyframes={barAnimation}
                        duration={storyLength}
                        triggerOnce={false}
                        className="test"
                        style={{ backgroundColor: 'white', height: '5px' }}
                      >
                        <div className="story-bar-element" style={{ width: '100%' }} />
                      </Reveal>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={i}
                      className="story-bar-element-container"
                      style={{
                        width: `${100 / numReps - 1}%`,
                        marginRight: i < numReps - 1 ? '1%' : '0',
                        backgroundColor: 'gray',
                        borderRadius: '16px',
                        height: '5px'
                      }}
                    >
                      <div
                        className="story-bar-element"
                        style={{ width: '0%', backgroundColor: 'white', height: '5px' }}
                      />
                    </div>
                  );
                }
              })}
            </>
          );
        }

  function goLeft() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    currStoryTime = 0;
  }

  function goRight() {
    setCurrentPage((prev) => Math.min(prev + 1, numReps - 1));
    currStoryTime = 0;
  }

  // Left half of screen for taps
  function handleLeftClick() {
    goLeft();
  }

  // Right half for taps
  function handleRightClick() {
    goRight();
  }

        function PButton() {
          const [fill, setFill] = useState(pauseButton);
          function play() {
            if(playing) {
              playing = false;
              setFill(playButton);
              let barArr = document.getElementsByClassName("test")
              console.log(document.getElementsByClassName("css-wtz79b"))
              for(let i = 0; i<barArr.length; i++) {
                barArr[i].className += ' paused'
              }
            } else {
              setFill(pauseButton);
              playing = true;
              let barArr = document.getElementsByClassName("test")
              for(let i = 0; i<barArr.length; i++) {
                barArr[i].className = 'css-1y8zshr'
              }
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
            if(!muted) {
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
        <StoryBars />
      </div>

      <div className="button-container">
        <PButton />
        <MButton />
      </div>

      <div className="left-right-container">
        <div id="left" onClick={handleLeftClick}></div>
        <div id="right" onClick={handleRightClick}></div>
      </div>

      <div style={{ marginTop: '60px', color: 'white' }}>
        {pages[currentPage]}
      </div>
    </div>
  );
}

export default Story;