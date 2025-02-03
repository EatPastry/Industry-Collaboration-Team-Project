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

    /**
     * Flips the signUp page number to update the page attributes
     */
    function switchPageNum(){
        if (formReference.current){
            formReference.current.reset();
        }

        if (pageNum === 1) {
            setNum(2)
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
                                    <input type="text" required></input>

                                    <label>Last Name</label>
                                    <input type="text" required></input>

                                    <div id="buttonWrapper">
                                        <button id="switchBtn" type="button" onClick={() => navigation('/')}>Log In</button>
                                        <button id="actionBtn" type="button" onClick={switchPageNum}>Next</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <label>Username</label>
                                    <input type="text" required></input>

                                    <label>Password</label>
                                    <input type="password" required></input>

                                    <div id="buttonWrapper">
                                        <button id="switchBtn" type="button" onClick={switchPageNum}>Back</button>
                                        <button id="actionBtn" type="button" >Sign Up</button>
                                    </div>
                                </>
                            )
                        }

                        <strong id="loginResponse"></strong>
                    </form>
                </div>
        </div>
    );
}


export default SignUp;

