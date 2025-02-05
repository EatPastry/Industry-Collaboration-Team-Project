import '../styles/styles.css'
import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header'
import "../controller/Authentication";
import {authenticateLogin} from "../controller/Authentication";
import GoogleButton from "../components/GoogleButton";

/**
 * Creates the elements for the Login page
 *@returns HTML elements of the login page
 */
function Login () {
    const [Username, setUsername] = React.useState('');
    const [Password, setPassword] = React.useState('');
    const navigation = useNavigate();

    /**
     * Handler for Button of id `loginBtn`
     * <br>
     * Calls {@Link validateLogin} for input validation
     * <br>
     * On success Navigates to Home page {@Link Recapped}, else denies access and displays message
     */
    async function onSubmit (){
        let responseMsg = document.getElementById('loginResponse') as HTMLInputElement;

        if (responseMsg != null) {
            if (await authenticateLogin(Username, Password)){
                responseMsg.innerText = "";
                navigation(`pages/Recapped/${Username}`);
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
                   <label>Username</label>
                   <input id="usernameBox" type="text" required
                          onChange={(e) => setUsername(e.target.value)}></input>

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
                    <GoogleButton />

                   <strong id="loginResponse"></strong>
               </form>
           </div>
            </div>
        </div>
    );
}


export default Login;