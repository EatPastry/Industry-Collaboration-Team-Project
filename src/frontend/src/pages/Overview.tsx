import React from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";

/**
 * Returns fun facts for the current signed-in User
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






function Overview(){
    const navigation = useNavigate();
    return (
        <div>

            <h1>Overview</h1>
            
        </div>
    );
}


export default Overview;


