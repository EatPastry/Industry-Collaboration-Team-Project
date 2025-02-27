import React, {useEffect, useState} from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
import { ShareFileButton } from "../components/ShareButton";
import Savings from "./recappedSubPages/Savings";
import Brand from "./recappedSubPages/Brand";
import ComparativeStats from "./recappedSubPages/ComparativeStats";
import Categories from "./recappedSubPages/Categories";
import TimeBasedInsights from "./recappedSubPages/TimeBasedInsights";
import Button from "../components/Button";
import {getSession, addTransaction} from "../services/API";
import GPTFacts from "./recappedSubPages/GPTFacts";



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

/**
 * Handles user sign out. <br>
 * Closes Session and Clears User cookies
 *
 * @param navigation of useNavigate() to navigate to Log in (/) page
 */
async function signOut(navigation : NavigateFunction){
  clearCookie(parseToken());
  await supabase.auth.signOut();
  navigation(`/`);
}

/**
 * Generates Recapped page for logged in user
 * @constructor
 */
function Recapped() {
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
  const [gptFacts, setGptFacts] = useState(false);


  /**
   * When one subpage is returned when its corresponding button is pressed
   * the other subpage states should be set to false
   */
   function toggleSubPages(subpage : string){
    setSavings(subpage == "savings")
    setCategories(subpage == "categories")
    setBrand(subpage == "brands")
    setComparativeStats(subpage == "comparativeStats")
    setTimeBasedInsights(subpage == "timeBasedInsights")
    setGptFacts(subpage == "gptFacts")
  }

  async function viewStory() {
    try {
      const {data: {session}} = await supabase.auth.getSession();
      if (!session || !session.user) {
        return;
      }
      navigation(`/pages/Story/${session.user.id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  useEffect(() => {
    // Log user out if without session
    const hasSession = checkSession(navigation)

    async function fetchUserData() {
      try {
          // Get the session for the current logged-in user
          const session = await getSession();
          if (!session){
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

  // Check that the current user has http cookie necessary for Recapped access
  const protectionError = ProtectUserRoutes(location.pathname);
  if (protectionError != null) {
    return protectionError;
  }

  function getStats() {
    return transactionAmount !== null
        ? `£${transactionAmount}`
        : "";
  }

  function Stats() {
    let value = getStats();
    return (
        <div>{value}</div>
    );
  }

  function App() {
    return (
        <ShareFileButton/>
    );
  }

  // Adds a transaction to the Transaction Table for Starbucks for the current logged-in User
  const transaction = async () =>  await addTransaction('d97cd214-f42c-4029-af54-6ada8f680bb6', 20, 10);



  return (

      <div className="Recapped">
        <button id="signOutBtn" onClick={() => signOut(navigation)}>sign out</button>
        <div className="container">
          <div className="user-greeting">
            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <header><h1>Hello, {firstName}!</h1></header>
            )}
          </div>

          <br/>
            <Button text="Add Starbucks Transaction" onClick={transaction} className="transaction-button"/>
          <br/>

          {/*Add Recapped Sub page buttons*/}
          <button onClick={() => toggleSubPages("savings")}>Savings</button>
          <button onClick={() => toggleSubPages("categories")}>Categories</button>
          <button onClick={() => toggleSubPages("brands")}>Brands</button>
          <button onClick={() => toggleSubPages("comparativeStats")}>Comparative Stats</button>
          <button onClick={() => toggleSubPages("timeBasedInsights")}>Time-Based Insights</button>
          <button onClick={() => toggleSubPages("gptFacts")}>Random Fun Facts (Chat-GPT)</button>
          <button onClick={() => viewStory()}>View story</button>

          <br/>

          {/*Compare subpage state && return subpage if true*/}
          {savings && <Savings/>}
          {categories && <Categories/>}
          {brand && <Brand/>}
          {comparativeStats && <ComparativeStats/>}
          {timeBasedInsights && <TimeBasedInsights/>}
          {gptFacts && <GPTFacts/>}

          <div className="share-container">
            <App/>
          </div>

          <canvas id="img-container" width="300" height="300"><Stats/></canvas>
        </div>
      </div>
  );
}


export default Recapped;