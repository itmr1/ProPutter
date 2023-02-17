import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
//import {RegisterButton} from './RegisterButton'
import axios from 'axios';

const send_register = (uid, paswd) => {
  return axios
    .post('http://52.91.136.75:4000/data/create_acc', {
      username: uid,
      password: paswd,
    })
    .then(response => {
      console.log(response.data);
      return response.data === 'success';
    })
    .catch(error => {
      console.log(error);
      return false;
    });
};

const RegisterButton = ({ name, pass, onClick }) => {
  return (
    <>
      <button type="submit" onClick={onClick}>
        Register
      </button>
    </>
  );
};

export const Register = (props) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(
    localStorage.getItem('isSuccess') || false
  );

  useEffect(() => {
    localStorage.setItem('isSuccess', isSuccess);
  }, [isSuccess]);

  const onChangeName = (newValue) => {
    setName(newValue.target.value);
  }
  const onChangePass = (newValue) => {
    setPass(newValue.target.value);
  }

  const onChangeEmail = (newValue) => {
    setEmail(newValue.target.value);
  }
  const handleClick = async () => {

    const success = await send_register(name, pass);
    setIsSuccess(success);
    if (success) {
      props.history.push('/dashboard');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  }
  return (
    <div className='auth-form-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <label htmlFor='name'>Full Name </label>
        <input value={name} name= 'name' id='name' placeholder= 'full Name' onChange={onChangeName} />
        <label htmlfor='email'>email</label>
        <input value = {email} type = 'email' placeholder="youremail@email.com"id='email' name='email' onChange={onChangeEmail}/>
        <label htmlfor='password'>password</label>
        <input value = {pass} type = 'password' placeholder="*******"id='password' name='password' onChange={onChangePass}/>
        <>
          {isSuccess ? (
            <Link to="/dashboard">
              <RegisterButton name={name} pass={pass} />
            </Link>
          ) : (
            <RegisterButton name={name} pass={pass} onClick={handleClick} />
          )}
        </>
      </form>
      <Link to='/login'>
        <button className='link-btn' onClick ={ () => props.onFormSwitch('login')}>Already have an account? Log In</button>
      </Link>
  </div>
  )
}
