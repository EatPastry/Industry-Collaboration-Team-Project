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
    let responseMsg = document.getElementById('loginResponse') as HTMLInputElement;
    const navigation = useNavigate();

    function onSubmit (){
        if (validatelogin(Username, Password)){
            if (responseMsg != null){
                responseMsg.innerText = "";
            }

            navigation(`/Recapped/${Username}`);

        }else{
            let usernameValue =  document.getElementById('usernameBox') as HTMLInputElement;
            let passwordValue =  document.getElementById('passwordBox') as HTMLInputElement;

            if (usernameValue != null){
                usernameValue.value = '';
            }
            if (passwordValue != null){
                passwordValue.value = '';
            }

            if (responseMsg != null){
                responseMsg.innerText = "Invalid Credentials";
            }
        }
    }

    return (
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
    );

}


export default Login;