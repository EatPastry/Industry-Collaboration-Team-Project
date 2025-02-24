import '../styles/styles.css'
import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header'
import "../controller/Authentication";
import {generateCookie, signInWithPassword} from "../controller/Authentication";
import SupabaseLogin from "../components/SupabaseLogin";
import {supabase} from "../utils/supabase";

/**
 * Creates the elements for the Login page
 *@returns HTML elements of the login page
 */
function Login () {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigation = useNavigate();

    /**
     * Handler for Button of id `loginBtn`
     * <br>
     * Calls {@Link signInWithPassword} to sign in
     * <br>
     * On success Navigates to Home page {@Link Recapped}, else denies access and displays message
     */
    async function onSubmit (){
        let responseMsg = document.getElementById('userResponse') as HTMLInputElement;

        if (responseMsg != null) {
            // Sign the user in using filled username and password. Generate a cookie and session
            if (await signInWithPassword(email, password)){
                responseMsg.innerText = "";

                const {data: {session}} = await supabase.auth.getSession();
                if (session && session.user.email){
                    generateCookie(session.user.id)
                    navigation(`pages/Recapped/${session.user.id}`);
                }else{
                    responseMsg.innerText = "Server Error";
                }
            }else{
                responseMsg.innerText = "Invalid Credentials";
            }
        }
    }

    return (
        <div className='LoginPage'>
            <Header />
            <div className='fadeIn'>
           <div className='login'>
                <div id="title">Log In</div>
               <form>
                   <label>Email</label>
                   <input id="emailBox" type="text" required
                          onChange={(e) => setEmail(e.target.value)}></input>

                   <label>Password</label>
                   <input id="passwordBox" type="password" required
                          onChange={(e) => setPassword(e.target.value)}></input>
                   <div id="buttonWrapper">
                       <button id="switchBtn" type="button" onClick={() => navigation('/SignUp')}>Create account
                       </button>
                       <button id="actionBtn" type="button" onClick={
                           onSubmit}>Log In
                       </button>
                   </div>
                   {/*Call Supabase Login to check for existing session and if google button should be displayed*/}
                   <SupabaseLogin/>

                   <strong id="userResponse"></strong>
               </form>
           </div>
            </div>
        </div>
    );
}


export default Login;