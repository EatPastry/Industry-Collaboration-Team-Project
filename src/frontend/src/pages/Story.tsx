import React, {useEffect, useState} from 'react';
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
    
        function StoryBars() {
            let numReps = 5;
            let result : React.ReactElement[] = [];
            const marginConst = 5;
            let elementWidth : Number = (window.screen.width - (marginConst * numReps)) / numReps;
            
            console.log(elementWidth);
            for(let i = 0; i < numReps - 1; i++) {
                result.push((
                    <div className='story-bar-element' style={{width:`${elementWidth}px`, marginRight:`${marginConst}px`}}></div>
                ));
            }
            result.push((
                <div className='story-bar-element' style={{width:`${elementWidth}px`}}></div>
            ));

            return <>{result}</>
        }

    return (
        <div className="Story">
            <title>My Recapped</title>
            <div className="story-bar">
                <StoryBars/>
            </div>
        </div>
    );
}

export default Story;