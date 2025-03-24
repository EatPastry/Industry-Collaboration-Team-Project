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
import MenuBar from "../components/MenuBar";
import {getFirstName} from "../services/API";
import Board from "../components/Board";
import ViewButton from "../components/ViewButton";
import Overview from "./Overview";



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


async function viewOverview(navigation : NavigateFunction) {
  try {
    const {data: {session}} = await supabase.auth.getSession();
    if (!session || !session.user) {
      return;
    }
    navigation(`/pages/Overview/${session.user.id}`);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
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
  const [funFacts, setFunFacts] = useState(false);


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
    setFunFacts(subpage == "funFacts")
  }


  useEffect(() => {
    // Log user out if without session
    const hasSession = checkSession(navigation)

    async function fetchUserData() {
      try {
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || !session.user) {
          return;
        }


        const name  = await getFirstName()
        if (name){
          setFirstName(name);
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

  return (
      <div className="Recapped">
         <Overview/>
      </div>
  );
}


export default Recapped;