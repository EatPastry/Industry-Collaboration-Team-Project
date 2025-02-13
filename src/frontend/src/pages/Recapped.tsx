import React, { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js"
import { useLocation } from 'react-router-dom';
import DataString from '../components/DataString';
import { ProtectUserRoutes } from "../components/ProtectRoutes";
import { ShareFileButton } from "../components/ShareButton";

// Supabase client initialization
const supabase = createClient(
  "https://bplqbfrbhimqbsvqyrhw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbHFiZnJiaGltcWJzdnF5cmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2NjYsImV4cCI6MjA0ODE5NjY2Nn0.xH5sdfWFLo5WOVqtr-uhXQ1s-hS6DLtVRLnLLa5u6Ik"
);

function Recapped() {
  const [transactionAmount, setTransactionAmount] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

    // checks that url is user specific
  const location = useLocation();

  useEffect(() => {
    async function fetchTransactionAmount() {
      try {
        const pathParts = location.pathname.split("/");
        const simulatedUserID = pathParts[pathParts.length - 1] || "user1";
        setUserName(simulatedUserID);
        const { data, error } = await supabase
          .from("Transactions")
          .select("transactionAmount")
          .eq("userID", simulatedUserID)
          .single();
        if (error) {
          console.error("Error fetching transaction:", error);
          setTransactionAmount("Error fetching transaction");
        } else if (data) {
          console.log("Transaction data fetched:", data);
          setTransactionAmount(data.transactionAmount.toString());
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

    fetchTransactionAmount();
  }, [location.pathname]);




  const protectionError = ProtectUserRoutes(location.pathname);
  console.log(location.pathname)
  console.log(protectionError)
  if (protectionError != null) {
    return protectionError;
  }

  function function1() {
    return "Value 1";
  }

  function function2() {
    return "Value 2";
  }

  function function3() {
    return transactionAmount !== null
      ? `You spent £${transactionAmount} this year`
      : "Loading...";
  } 

  function function4() {
    return "Value 4";
  }

  function function5() {
    return "Value 5";
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
        
        <div className='color_background'>
          <div className="container">
            <div className="user-greeting">
              {loading ? (
                  <p>Loading user data...</p>
              ) : (
                  <header><h1>Hello, {userName ? userName : "User"}!</h1></header>
              )}
            </div>

            <div className="test1">
              <DataString functions={function1}/>
            </div>

            <div className="test2">
              <DataString functions={function2}/>
            </div>

            <div className="test3">
              <DataString functions={function3}/>
            </div>

            <div className="test4">
              <DataString functions={function4}/>
            </div>

            <div className="test5">
              <DataString functions={function5}/>
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