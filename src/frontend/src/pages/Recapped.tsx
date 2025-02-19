import React, {useEffect, useState} from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import DataString from '../components/DataString';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../controller/Authentication";
import { ShareFileButton } from "../components/ShareButton";

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

  useEffect(() => {
    // Log user out if without session
    const hasSession = checkSession(navigation)

    async function fetchUserData() {
      try {
        const {data : {session}} = await supabase.auth.getSession();
        if (!session || !session.user){
          return;
        }


        // fetch current users firstname from the User table
        const {data : usersName} = await supabase.from('User').select('firstName').eq('userID', session.user.id).single();
        if (usersName) {
          setFirstName(usersName.firstName?.toString());
        }

        // Fetch an instance of a transaction the current user has made from the Transaction table
        const { data, error } = await supabase
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


    return ()=> {
      clearInterval(hasSession)
    };
  }, [location.pathname, navigation]);

  // Check that the current user has http cookie necessary for Recapped access
  const protectionError = ProtectUserRoutes(location.pathname);
  if (protectionError != null) {
    return protectionError;
  }

  function function3() {
    return transactionAmount !== null
      ? `You spent £${transactionAmount} this year`
      : "Loading...";
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

  return (
      
      <div className="Recapped">
        <button id = "signOutBtn" onClick={() => signOut(navigation)}>sign out</button>
          <div className="container">
            <div className="user-greeting">
              {loading ? (
                  <p>Loading user data...</p>
              ) : (
                  <header><h1>Hello, {firstName}!</h1></header>
              )}
            </div>

            <div className="test1">
              <DataString functions={() => {return "Value 1"}}/>
            </div>

            <div className="test2">
              <DataString functions={() => {return "Value 2"}}/>
            </div>

            <div className="test3">
              <DataString functions={function3}/>
            </div>

            <div className="test4">
              <DataString functions={() => {return "Value 4"}}/>
            </div>

            <div className="test5">
              <DataString functions={() => {return "Value 5"}}/>
            </div>

            <div className="share-container">
              <App/>
            </div>
              
            <canvas id="img-container" width="300" height="300"><Stats/></canvas>
          </div>
      </div>
  );
}


export default Recapped;