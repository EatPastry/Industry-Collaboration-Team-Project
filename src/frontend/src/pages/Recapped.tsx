import React, {useEffect, useState} from 'react';
import {Navigate, NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import DataString from '../components/DataString';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../controller/Authentication";
import Button from "../components/Button";



export function checkSession(navigation : NavigateFunction){
  return setInterval(async () => {
    let { error} = await supabase.auth.getUser();
    if (error) {
      clearCookie(parseToken());
      navigation(`/`);
    }
  }, 3000)
}

async function signOut(navigation : NavigateFunction){
  clearCookie(parseToken());
  await supabase.auth.signOut();
  navigation(`/`);
}

function Recapped() {
  const navigation = useNavigate();
  const [transactionAmount, setTransactionAmount] = useState<string | null>(null);
  const [email, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  let [firstName, setFirstName] = useState('');
  // checks that url is user specific
  const location = useLocation();

  useEffect(() => {
    const hasSession = checkSession(navigation)

    async function fetchUserData() {
      try {
        const {data : {session}} = await supabase.auth.getSession();
        if (!session || !session.user){
          return;
        }

        const {data : usersName} = await supabase.from('User').select('firstName').eq('userID', session.user.id).single();
        if (usersName) {
          setFirstName(usersName.firstName?.toString());
        }

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

  // Function to add transaction to Supabase ************************
  const addTransaction = async () => {
    const fail = false;
    /*const { data, error } = await supabase
        .from("transactions") // Ensure this matches Supabase table name
        .insert([
          {
            user: userName,
            value: 10,
            brand: "Starbucks",
            timestamp: new Date().toISOString(),
          },
        ]);
    */
    if (fail) {
      console.error("Error adding transaction.");
    } else {
      console.log("Transaction added.");
    }
  };
  // *******************************************************************


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

          {/* ***************************************************** */}
          {/* Top-left button using Button.tsx prop*/}
          <Button text="Add Starbucks Transaction" onClick={addTransaction} className="transaction-button"/>
          {/* ***************************************************** */}


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
        </div>
      </div>
  );
}

export default Recapped;