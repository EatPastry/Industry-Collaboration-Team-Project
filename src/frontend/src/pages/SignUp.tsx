import '../styles/styles.css'
import React, {useRef, useState} from 'react';
import Header from '../components/Header'
import "../controller/Authentication";
import {useNavigate} from 'react-router-dom';

/**
 * Creates the elements for the SignUp page
 *@returns HTML elements of the SignUp page
 */
function SignUp () {
    const navigation = useNavigate();
    const [pageNum, setNum] = useState(1)
    const formReference = useRef<HTMLFormElement>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    /**
     * Flips the signUp page number to update the page attributes
     */
    function switchPageNum(){
        if(firstName.trim() === "") {
            setResponse("First Name Required");
            return;
        }

        if (pageNum === 1) {
            setNum(2)
            setResponse("");
        }else{
            setNum(1);
        }


    }


    return (
        <div className='signUpPage'>
            <Header />
                <div className='login'>
                    <div id="title">Sign Up</div>
                    <form ref={formReference}>
                        {
                            pageNum === 1? (
                                <>
                                    <label>First Name</label>
                                    <input type="text" id = "firstName" value = {firstName}
                                           onChange={(e) => setFirstName(e.target.value.trim())}
                                           required></input>

                                    <label>Last Name</label>
                                    <input type="text" id = "lastName" placeholder="(optional)" value = {lastName}
                                           onChange={(e) => setLastName(e.target.value.trim())}
                                           required></input>

                                    <div id="buttonWrapper">
                                        <button id="switchBtn" type="button" onClick={() => navigation('/')}>Log In</button>
                                        <button id="actionBtn" type="button" onClick={switchPageNum}>Next</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <label>Username</label>
                                    <input type="text" value = {userName}
                                           onChange={(e) => setUserName(e.target.value.trim())}
                                           required
                                    ></input>

                                    <label>Password</label>
                                    <input type="password" value = {password}
                                           onChange={(e) => setPassword(e.target.value.trim())}
                                           required></input>

                                    <div id="buttonWrapper">
                                        <button id="switchBtn" type="button" onClick={switchPageNum}>Back</button>
                                        <button id="actionBtn" type="button" >Sign Up</button>
                                    </div>
                                </>
                            )
                        }

                        <strong id="loginResponse">{response}</strong>
                    </form>
                </div>
        </div>
    );
}


export default SignUp;

