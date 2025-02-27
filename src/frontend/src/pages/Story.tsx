import React, {useEffect, useState, useRef} from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
// import DataString from '../components/DataString';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
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
    const navigation = useNavigate();
    const ref = useRef();
    let numReps = 5;
    const [fill, setFill] = useState(Array(numReps).fill(0));

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
            document.getElementById(i.toString())!.style.width = '10px';
          }
          //setFill(100);
          /*setInterval(async () => {
            fill[i] = 52
            console.log("A")
          }, 1000);*/
          
          
          
          //console.log(document.getElementsByClassName("story-bar-element"))
        }
    
        function StoryBars() {
            let result : React.ReactElement[] = [];
            let idString : string;
            let marginConst = 1;
            let elementWidth : Number = (100 - (marginConst * numReps-1)) / numReps;
            console.log(elementWidth);
            for(let i = 0; i < numReps; i++) {
              idString = i.toString()
              if(i == numReps - 1)
                marginConst = 0;
                result.push((
                  <div className='story-bar-element-container' style={{width:`${elementWidth}%`, marginRight:`${marginConst}%`}}>
                    <div className='story-bar-element' id={idString} style={{width:`${fill[i]}%`}}></div>
                  </div>
                ));
            }
            
            
            return <>{result}</>
            
        }

    return (
        <div className="Story">
            <div className="story-bar">
                <StoryBars/>
                
            </div>
        </div>
    );
}

export default Story;