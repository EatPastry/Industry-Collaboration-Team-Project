import React from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
import Board from "../components/Board";



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
<Board/>

        </div>
    );
}


export default Overview;


