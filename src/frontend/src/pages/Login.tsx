import '../styles/styles.css'
import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header'


function validatelogin (username : string, password: string) {
    let validCredentials : string [][] = [['user1', 'password1'],['user2', 'password2']];

    if ((username === validCredentials[0][0] && password === validCredentials[0][1])
        || (username === validCredentials[1][0] && password === validCredentials[1][1])) {
        return true
    }
    return false
}


function Login () {
    const [Username, setUsername] = React.useState('');
    const [Password, setPassword] = React.useState('');
    const navigation = useNavigate();

    function onSubmit (){
        let responseMsg = document.getElementById('loginResponse') as HTMLInputElement;
        if (responseMsg != null) {
            if (validatelogin(Username, Password)) {
                    responseMsg.innerText = "";
                navigation(`pages/Recapped/${Username}`);
            } else {
                    responseMsg.innerText = "Invalid Credentials";
            }
        }
    }

    return (
        <div className='color_background'>
        <div className='LoginPage'>
            <Header />
       <div className='login'>
            <h1>Login</h1>
            <form>
                <label>Username</label>
                <input id = "usernameBox" type="text" required
                onChange = {(e) => setUsername(e.target.value)}></input>

                <label>Password</label>
                <input id = "passwordBox" type="password" required
                onChange = {(e) => setPassword(e.target.value)}></input>

                <button id = "loginBtn" type="button" onClick={onSubmit}>Login</button>
                <strong id = "loginResponse"></strong>
            </form>
           </div>
           </div>
        </div>
    );

}


export default Login;