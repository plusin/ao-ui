import React, {useState, useEffect} from "react";
import './login.scss'
import { useTranslation } from 'react-i18next';
import AoButton from '../../Common/ao-button/ao-button';
import AoInput from '../../Common/ao-input/ao-input';
import AoDialog from '../../Common/ao-dialog/ao-dialog';
import AoCheckbox from "../../Common/ao-checkbox/ao-checkbox";
import { useDispatch } from 'react-redux';
import { setActiveDialog, displayLoadingText } from '../../../redux/UIFlowSlice'
import { ValidateEmail, ValidatePassword } from "../../../Tools/Utils";

export default function LogIn() {
  const [userCredentials, setCredentials] = useState({email:'', password:'', storeCredentials:false});
  const {email, password, storeCredentials } = userCredentials;
  const { t } = useTranslation();
  const dispatch = useDispatch()
  useEffect(() => {
    const credentials = window.parent.BabelUI.GetCredentials()
    console.log(credentials);
    if (credentials.user.length > 0 || credentials.password.length > 0) {
      setCredentials({ ...userCredentials, 
        storeCredentials: true,
        email: credentials.user,
        password: credentials.password});  
    }
  },[]);
  const handleChange = event => {
    const { value, name } = event.target;
    setCredentials({ ...userCredentials, [name]: value});
  }

  const rememberLogin = event => {
    setCredentials({ ...userCredentials, storeCredentials: !storeCredentials});
  }
  const updateDialog = event => {
    event.preventDefault();
    dispatch(setActiveDialog('create-account'));
  }
  const DoLogin = event => {
    event.preventDefault();
    dispatch(displayLoadingText('connecting-to-server'))
    window.parent.BabelUI.Login(email, password);
  }

  const DoClose = event => {
    event.preventDefault();
    window.parent.BabelUI.CloseClient();
  }
  const validUser = ValidateEmail(email)
  const validPwd = ValidatePassword(password)
  const enableLogin = validUser && validPwd && email.length > 0 && password.length > 0
  return (
    <AoDialog styles='login-dialog-pos'>
      <h1 className='login-header'>{t('log in').toUpperCase()}</h1>
        <div className="input-area">
          <div className='named-input user'>
            <p className='name'>
              {t('email').toUpperCase()}
            </p>
            <AoInput name="email" type="email" IsValid={validUser} value={email} required handleChange={handleChange} />
          </div>
          <div className='named-input password'>
            <p className='name'>
              {t('password').toUpperCase()}
            </p>
            <AoInput name="password" IsValid={validPwd} type="password" value={password} required handleChange={handleChange} />
          </div>
          <AoCheckbox label={t('Remember me')} name="storeCredentials" styles='split-area right-padding' handleChange={rememberLogin} state={storeCredentials} />
          <AoButton caption='connect' styles='split-area' isRed={true} disabled={!enableLogin}  onClick={ DoLogin }/>
      </div>
      <div className='bottom-line'>
        <AoButton caption='account' styles='split-area' onClick={ updateDialog }/>
        <span className="horizontal-gap10"></span>
        <AoButton caption='exit' styles='split-area' onClick={ DoClose }/>
      </div>
    </AoDialog>
  )
}