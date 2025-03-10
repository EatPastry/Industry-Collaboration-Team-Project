import React from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
import Board from "../components/Board";
import Header from "../components/Header"
import { ShareFileButton } from '../components/ShareButton';

export function checkSession(navigation : NavigateFunction){
    return setInterval(async () => {
      let { error} = await supabase.auth.getUser();
      if (error) {
        clearCookie(parseToken());
        navigation(`/`);
      }
    }, 3000)
  }

function Overview(){
    const navigation = useNavigate();
    return (
      
        <div className="overview">


<br></br>

        <h1 style={{ fontSize: "4rem", fontWeight: "bold", textAlign: "center" }}>
          Your 2025 Recapped
        </h1>
<Board/>

        </div>
    );
}


function App() {
  return (
      <ShareFileButton/>
  );
}

export default Overview;


