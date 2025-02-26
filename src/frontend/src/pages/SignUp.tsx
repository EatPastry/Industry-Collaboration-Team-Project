import '../styles/styles.css'
import React, {useRef, useState} from 'react';
import Header from '../components/Header'
import "../services/Authentication";
import {useNavigate} from 'react-router-dom';
import SupabaseLogin from "../components/SupabaseLogin";
import {createAccount, generateCookie, signInWithPassword} from "../services/Authentication";
import {supabase} from "../utils/supabase";

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

    /**
     * Calls Create an Account, if this succeeds it then signs in <br>
     * Generates a cookie and adds a row to the User table for new user
     *
     * @param email of the user to validate
     * @param password of the user to validate
     * @param firstName of the user to validate
     * @param lastName of the user to validate
     */
    async function validateAccount(email : string, password: string, firstName : string, lastName: string){
        // check that entered details are valid
        let {success, response} = await createAccount(email, password)

        // return if details are not valid and account not created
        if (!success){
            setResponse(response);
            return
        }

        // Sign in to created account
        let result = await signInWithPassword(email, password)
        if (!result){
            setResponse(response);
            return
        }

        // Generate a session and cookie for the user then navigate to Recapped page
        const {data: {session}} = await supabase.auth.getSession();
        if (session && session.user.email) {
            generateCookie(session.user.id)

            await supabase.from('User').insert([{
                userID : session.user.id, firstName : firstName, lastName : lastName, email : email}]);

            navigation(`/pages/Recapped/${session.user.id}`);
        }

    }


    return (
        <div className='signUpPage'>
            <Header/>
            <div className='login'>
                <div id="title">Sign Up</div>
                <form ref={formReference}>
                    {
                        // Display firstname and lastname input fields for 'page' 1
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
                                    {/*Calls switchPageNum to switch to page 2*/}
                                    <button id="actionBtn" type="button" onClick={switchPageNum}>Next</button>
                                </div>
                            </>
                        ) : (
                            // Display email and password input fields for 'page' 2
                            <>
                                <label>Email</label>
                                <input type="text" id="signup-email" value={email}
                                       onChange={(e) => setEmail(e.target.value.trim())}
                                       required
                                ></input>

                                <label>Password</label>
                                <input type="password" id="signup-password" value={password}
                                       onChange={(e) => setPassword(e.target.value.trim())}
                                       required></input>

                                <div id="buttonWrapper">
                                    {/*Calls switchPageNum to switch back to page 1*/}
                                    <button id="switchBtn" type="button" onClick={switchPageNum}>Back</button>
                                    <button id="actionBtn" type="button" onClick={()=> validateAccount(email, password, firstName, lastName)}>Sign Up</button>
                                </div>
                            </>
                        )
                    }
                    <SupabaseLogin />
                    <strong id="userResponse">{response}</strong>
                </form>
            </div>
        </div>
    );
}


export default SignUp;

