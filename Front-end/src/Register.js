import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';





export const Register = ({props, ip}) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onChangeName = (newValue) => {
    setName(newValue.target.value);
  }
  const onChangePass = (newValue) => {
    setPass(newValue.target.value);
  }

  const onChangeEmail = (newValue) => {
    setEmail(newValue.target.value);
  }
  const send_register = async (uid, paswd) => {

    try {
      const response = await axios.post(''+ip+'/data/create_acc', {
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
    const result = await send_register(name, pass);
    console.log(result)
    if (!result) {
      setError(true);
    } else {
      navigate('/login');
    }
  }
  return (
    <div className='auth-form-container'>
      <div className = 'form-wrapper'>
      <form className='register-form' onSubmit={handleSubmit}>
        <div>
        <div>
        <label htmlFor='name'>Username </label>
        </div>
        <input value={name} name= 'name' id='name' placeholder= 'username' onChange={onChangeName} />
        </div>
        <div>
        <div>
        <label htmlfor='password'>Password</label>
        </div>
        <input value = {pass} type = 'password' placeholder="*******"id='password' name='password' onChange={onChangePass}/>
        </div>
        {error ? <p>Error occurred, please try again</p> : null}
        <div>
        <button type="submit">Register</button>
        </div>
      </form>
      <Link to='/login'>
        <button className='link-btn' onClick ={ () => props.onFormSwitch('login')}>Already have an account? Log In</button>
      </Link>
      </div>
  </div>
  )
}
