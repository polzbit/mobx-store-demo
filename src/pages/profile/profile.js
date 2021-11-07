import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navbar/navbar';
import './profile.scss';
import { useHistory } from 'react-router-dom';
import { to_Encrypt } from '../../aes';
import { validateEmail } from '../../utils';

const ProfilePage = ({store, state, setState, filters, setFilters}) => {
    const MIN_CHARACTERS = 6;
    const MAX_CHARACTERS = 60;
    /* ----- State ------ */
    const [data, setData] = useState({
        name: '',
        email:'',
        old_psw:'',
        psw: '',
        re_psw: '',
        msg:'',
        msgStyle: 'error',
    });
    /* ----- Navigation ----- */
    let history = useHistory();
    /* ----- UI Functions ------ */
    const handleNameChange = (e) => {
        setData(prevData => ({
            ...prevData,
            name: e.target.value.trim(),
        }));
    }
    const handleEmailChange = (e) => {
        setData(prevData => ({
            ...prevData,
            email: e.target.value.trim(),
        }));
    }
    const handleOldPswChange = (e) => {
        setData(prevData => ({
            ...prevData,
            old_psw: e.target.value.trim(),
        }));
    }
    const handlePswChange = (e) => {
        setData(prevData => ({
            ...prevData,
            psw: e.target.value.trim(),
        }));
    }
    const handleRePswChange = (e) => {
        setData(prevData => ({
            ...prevData,
            re_psw: e.target.value.trim(),
        }));
    }
    const changeName = () => {
        if(data.name.length >= MAX_CHARACTERS) {
            logMsg('Name too long', 'error');
            return;
        }
        else if(data.name === '') {
            logMsg("Name can't be empty", 'error');
            return;
        }
        const res = store.usersStore.updateName(state.user.id, data.name);
        if(res) {
            logMsg('Name changed', 'success');
        } else {
            logMsg('Error', 'error');
        }
    }
    const changeEmail = () => {
        if(!validateEmail(data.email)) {
            logMsg('Email not valid', 'error');
            return;
        }
        const res = store.usersStore.updateEmail(state.user.id, data.email);
        if(res) {
            logMsg('Email changed', 'success');
        } else {
            logMsg('Error', 'error');
        }
    }
    const changePsw = () => {
        if(data.old_psw.length >= MAX_CHARACTERS) {
            logMsg('Old password too long', 'error');
            return;
        }
        if(data.old_psw.length < MIN_CHARACTERS) {
            logMsg('Old assword too short', 'error');
            return;
        }
        if(data.psw.length >= MAX_CHARACTERS) {
            logMsg('New password too long', 'error');
            return;
        }
        if(data.psw.length < MIN_CHARACTERS) {
            logMsg('New password too short', 'error');
            return;
        }
        if(data.psw !== data.re_psw) {
            logMsg('Password mismatch', 'error');
            return;
        }
        const res = store.usersStore.updatePsw(state.user.id, to_Encrypt(data.old_psw),to_Encrypt(data.psw),to_Encrypt(data.re_psw));
        if(res) {
            logMsg('Password changed', 'success');
        } else {
            logMsg('Error', 'error');
        }
    }
    const logMsg = (msg, style) => {
        setData(prevData => ({
            ...prevData,
            msg: msg,
            msgStyle: style,
        }));
        setTimeout(() => {
            setData(prevData => ({
                ...prevData,
                msg: '',
            }));
          }, 3000);
    }
    /* ----- Reder ------ */
    useEffect(() => {
        // on page load
        // check if user connect
        console.log(state);
        if(state.user === undefined) {
           history.push('/');
        } else {
            setData(prevData => ({
                ...prevData,
                name: state.user.name,
                email: state.user.email,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return(
        <div className='profile-page'>
            <NavBar state={state} filters={filters} setFilters={setFilters}/>
            <div className='profile'>
                <h1>Edit your profile</h1>
                <label htmlFor='username'>Your public name</label>
                <div className='profile-row'>
                    <input type='text' name='username' value={data.name} onChange={handleNameChange}/>
                    <button type='button' onClick={changeName}> Change </button>
                </div>
                <label htmlFor='email'>Your email address</label>
                <div className='profile-row'>
                    <input type='email' name='email' value={data.email} onChange={handleEmailChange}/>
                    <button type='button' onClick={changeEmail}> Change </button>
                </div>
                <h2>Change your password</h2>
                <div className='profile-psw'>
                    <label htmlFor='old_psw'>Enter your old password</label>
                    <input type='password' name='old_psw' value={data.old_psw} onChange={handleOldPswChange}/>
                    <label htmlFor='psw'>Enter your new password</label>
                    <input type='password' placeholder='At least 6 characters' name='psw' value={data.psw} onChange={handlePswChange}/>
                    <label htmlFor='re_psw'>Re-enter your password</label>
                    <input type='password' name='re_psw' value={data.re_psw} onChange={handleRePswChange}/>
                    {data.msg !== '' && <p className={data.msgStyle}>{data.msg}</p>}
                    <button type='button' className='changwPswBtn' onClick={changePsw} >Change Password</button>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage;