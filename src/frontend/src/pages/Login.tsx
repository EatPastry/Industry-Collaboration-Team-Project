import '../styles/styles.css'
import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header'
import "../controller/Authentication";
import {authenticateLogin} from "../controller/Authentication";

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
        <div className='color_background'>
        <div className='LoginPage'>
            <Header />
       <div className='login'>
            <div id="title">Log in</div>
            <form>
                <label>Username</label>
                <input id = "usernameBox" type="text" required
                onChange = {(e) => setUsername(e.target.value)}></input>

                <label>Password</label>
                <input id = "passwordBox" type="password" required
                onChange = {(e) => setPassword(e.target.value)}></input>

                <button id = "loginBtn" type="button" onClick={onSubmit}>Log in</button>
                <strong id = "loginResponse"></strong>
            </form>
           </div>
           </div>
        </div>
    );
}


export default Login;