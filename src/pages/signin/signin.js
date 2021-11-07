import React, { useState } from 'react';
import './signin.scss';
import { useHistory } from 'react-router-dom';
import { to_Encrypt } from "../../aes.js";
import { validateEmail } from '../../utils';

const SigninPage = ({store, state, setState}) => {
    const MIN_CHARACTERS = 6;
    const MAX_CHARACTERS = 60;
    /* ----- State ------ */
    const [data, setData] = useState({
        btnTxt: 'Continue',
        email:'',
        psw:'',
        error:-1,
        msg:'',
    });
    /* ----- Navigation ------ */
    let history = useHistory();
  
    /* ----- UI Functions ------ */
    const logError = (code, msg) => {
        setData(prevState => ({
            ...prevState,
            error: code,
            msg: msg,
        }));
    }

    const handleEmailChange = (e) => {
        setData(prevState => ({
            ...prevState,
            email: e.target.value.trim(),
        }));
    }
    const handlePswChange = (e) => {
        setData(prevState => ({
            ...prevState,
            psw: e.target.value.trim(),
        }));
    }
    const goToNextStep = () => {
        // validate email
        if(validateEmail(data.email) === null) {
            logError(0, 'Email address not valid')
            return;
        }
        // check if user exists
        if(!store.usersStore.isEmailExists(data.email)) {
            logError(0, 'Email address not exists')
            return;
        }
        // go to password check
        setData(prevState => ({
            ...prevState,
            btnTxt: 'Sign-In',
        }));
    }
    const loginUser = () => {
        if(data.psw.length < MIN_CHARACTERS || data.psw.length >= MAX_CHARACTERS) {
            logError(1, 'Password not valid')
            return;
        }
        const auth = store.usersStore.authUser(data.email, to_Encrypt(data.psw));
        if(auth) {
            setState(prevState => ({
                ...prevState,
                user: auth,
            }));
            history.push('/');
        }
        else {
            logError(1, 'Password not valid');
        }
    }

    /* ----- Render ------ */
    return(
        <div className='signin-page'>
            <div className='main-logo' onClick={() => history.push('/')}>
                <span> Logo </span>
            </div>
            <div className='sign-info'>
                <h1>Sign-In</h1>
                <label htmlFor='email' > Email Address </label>
                <input type='email' name='email' value={data.email} onChange={handleEmailChange} disabled={data.btnTxt !== 'Continue' ? 'disabled' : ''}/>
                {data.error === 0 && 
                    <span className='error'>! {data.msg}</span>
                }
                {(()=> {
                    if(data.btnTxt !== 'Continue' ){
                        return(
                        <div>
                            <label htmlFor='psw' > Password </label>
                            <input type='password' name='psw' value={data.psw} onChange={handlePswChange}/>
                            {data.error === 1 && <span className='error'>! {data.msg}</span>}
                        </div>
                        )
                }})()
                }
                <button type='button' onClick={data.btnTxt === 'Continue' ? goToNextStep: loginUser}> {data.btnTxt} </button>
                <p>By continuing, you agree to company's <span className='link'>Conditions of Use</span> and <span className='link'>Privacy Notice.</span> </p>
                <div className='forgot'>
                    <span className='link'>Forgot your password?</span>
                </div>
            </div>
            <div className='register'>
                <button type='button' onClick={() => history.push('/register')}> Create new account </button>
            </div>
        </div>
    )
}

export default SigninPage;