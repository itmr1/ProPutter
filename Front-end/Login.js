import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



export const Login = ({props, ip}) => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onChangeName = (newValue) => {
    setName(newValue.target.value);
  }
  const onChangePass = (newValue) => {
    setPass(newValue.target.value);
  }
  const send_login = async (uid, paswd) => {

    try {
      const response = await axios.post(''+ip+'/data/check_acc', {
        username : uid,
        password : paswd
      });
      console.log(response.data);
      if (response.data === 'success') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await send_login(name, pass);
    console.log(result)
    if (!result) {
      setError(true);
    } else {
      navigate('/dashboard');
    }
  }
  return (
    <div className='auth-form-container'>
      <div className = 'form-wrapper'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
        <div>
        <label htmlfor='user'>Username</label>
        </div>
        <input value = {name} type = 'username' placeholder="username"id='username' name='username' onChange={onChangeName}/>
        </div>
        <div>
        <div>
        <label for='password'>Password</label>
        </div>
        <input htmlvalue = {pass} type = 'password' placeholder="*******"id='password' name='password' onChange={onChangePass}/>
        </div>
        {error ? <p>Error occurred, please try again</p> : null}
        <div>
        <button type="submit">Login</button>
        </div>
      </form>
      <div>
        <Link to='/register'>
          <button className='link-btn' onClick={() => props.onFormSwitch('register')}>Don't have an account? Register</button>
        </Link>
      </div>
      </div>
    </div>
  )
}
