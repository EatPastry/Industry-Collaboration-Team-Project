import '../styles/styles.css'
import React, {useRef, useState} from 'react';
import Header from '../components/Header'
import "../controller/Authentication";
import {useNavigate} from 'react-router-dom';
import SupabaseLogin from "../components/SupabaseLogin";
import {authenticateLogin, createAccount} from "../controller/Authentication";


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
    const [email, setEmail] = useState('');
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


    async function validateAccount(email : string, password: string, firstName : string, lastName: string){
        let result = await createAccount(email, password, firstName, lastName)
        let cookieResult =  await authenticateLogin(email, password)
        if (result && cookieResult){
            navigation(`/pages/Recapped/${email}`);
        }
    }


    return (
        <div className='signUpPage'>
            <Header/>
            <div className='login'>
                <div id="title">Sign Up</div>
                <form ref={formReference}>
                    {
                        pageNum === 1 ? (
                            <>
                                <label>First Name</label>
                                <input type="text" id="firstName" value={firstName}
                                       onChange={(e) => setFirstName(e.target.value.trim())}
                                       required></input>

                                <label>Last Name</label>
                                <input type="text" id="lastName" placeholder="(optional)" value={lastName}
                                       onChange={(e) => setLastName(e.target.value.trim())}
                                       required></input>

                                <div id="buttonWrapper">
                                    <button id="switchBtn" type="button" onClick={() => navigation('/')}>Log In</button>
                                    <button id="actionBtn" type="button" onClick={switchPageNum}>Next</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label>Email</label>
                                <input type="text" value={email}
                                       onChange={(e) => setEmail(e.target.value.trim())}
                                       required
                                ></input>

                                <label>Password</label>
                                <input type="password" value={password}
                                       onChange={(e) => setPassword(e.target.value.trim())}
                                       required></input>

                                <div id="buttonWrapper">
                                    <button id="switchBtn" type="button" onClick={switchPageNum}>Back</button>
                                    <button id="actionBtn" type="button" onClick={()=> validateAccount(email, password, firstName, lastName)}>Sign Up</button>
                                </div>
                            </>
                        )
                    }
                    <SupabaseLogin/>
                    <strong id="loginResponse">{response}</strong>
                </form>
            </div>
        </div>
    );
}


export default SignUp;

