import React, { useState } from 'react';
import './register.scss';
import { useHistory } from 'react-router-dom';
import { to_Encrypt } from "../../aes.js";
import { validateEmail } from '../../utils';

const RegisterPage = ({store}) => {
    const MIN_LENGTH = 6;
    const MAX_CHARACTERS = 60;
    /* ----- State ------ */
    const [state, setState] = useState({
        username: '',
        email:'',
        psw:'',
        re_psw:'',
        error:-1,
        msg:'',
    });
    /* ----- Navigation ------ */
    let history = useHistory();
    /* ----- UI Functions ------ */
    const logError = (code, msg) => {
        setState(prevState => ({
            ...prevState,
            error: code,
            msg: msg,
        }));
    }
    const handleUsernameChange = (e) => {
        setState(prevState => ({
            ...prevState,
            username: e.target.value.trim(),
        }));
    }
    const handleEmailChange = (e) => {
        setState(prevState => ({
            ...prevState,
            email: e.target.value.trim(),
        }));
    }
    const handlePswChange = (e) => {
        setState(prevState => ({
            ...prevState,
            psw: e.target.value.trim(),
        }));
    }
    const handleRePswChange = (e) => {
        setState(prevState => ({
            ...prevState,
            re_psw: e.target.value.trim(),
        }));
    }
    const registerUser = () => {
        if(state.username === '' ) {
            logError(0, "Username can't be empty");
            return;
        } else if(state.username.length >= MAX_CHARACTERS)  {
            logError(0, "Username too long");
            return;
        }
        if(!validateEmail(state.email)) {
            logError(1, 'Email address not valid');
            return;
        }
        if(state.psw.length < MIN_LENGTH) {
            logError(2, 'Must contain at least 6 characters');
            return;
        }
        else if(state.psw.length >= MAX_CHARACTERS) {
            logError(2, 'Password too long');
            return;
        }
        if(state.psw !== state.re_psw) {
            logError(3, 'Passwords mismatch');
            return;
        }
        
        const user = store.usersStore.createUser({name: state.username, email:state.email, psw_hash:to_Encrypt(state.psw), re_psw_hash:to_Encrypt(state.re_psw)});
        if(user === 0) {
            // user already registered
            logError(0, "Name can't be empty");
        }
        else if(user === 1) {
            // user already registered
            logError(1, 'User already registered');
        }
        else if(user === 3) {
            // re-psw not match
            logError(3, 'Passwords mismatch');
        }
        else {
            // user created go to sign in
            history.push('/signin');
        }
        
    }
    /* ----- Render ------ */
    return(
        <div className='register-page'>
            <div className='main-logo' onClick={() => history.push('/')}>
                <span> Logo </span>
            </div>
            <div className='register-info'>
                <h1>Create Account</h1>
                <label htmlFor='name' > Your name </label>
                <input type='text' name='name' value={state.username} onChange={handleUsernameChange}/>
                {state.error === 0 && 
                    <span className='error'>! {state.msg}</span>
                }
                <label htmlFor='email' > Email Address </label>
                <input type='email' name='email' value={state.email} onChange={handleEmailChange}/>
                {state.error === 1 && 
                    <span className='error'>! {state.msg}</span>
                }
                <label htmlFor='psw' > Password </label>
                <input type='password' placeholder='At least 6 characters' name='psw' value={state.psw} onChange={handlePswChange}/>
                {state.error === 2 && 
                    <span className='error'>! {state.msg}</span>
                }
                <label htmlFor='re-psw' > Re-enter password </label>
                <input type='password'  name='re-psw' value={state.re_psw} onChange={handleRePswChange}/>
                {state.error === 3 && 
                    <span className='error'>! {state.msg}</span>
                }
                <button type='button' onClick={registerUser}> Create your account </button>
                <p className='mb-1'>By creating an account, you agree to company's <span className='link'>Conditions of Use</span> and <span className='link'>Privacy Notice.</span> </p>
                <p>Already have an account? <span className='link' onClick={() => history.push('/signin')}>Sign-In</span></p>
            </div>
        </div>
    )
}
export default RegisterPage;