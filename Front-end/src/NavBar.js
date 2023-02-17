import React from 'react';
import {Link} from 'react-router-dom'
//import icl from "./icl.png"

export const NavBar = () => {
  return (
    <div className='NavBar'>
      {/* <div>
        <img src = {icl}/>
      </div> */}
      <div id ='links'>
            <div>
            <Link to="/"  style={{ textDecoration: 'none' }}><div  className='link'>Home</div></Link>
            </div>
            <div>
            <Link to="/register" style={{ textDecoration: 'none' }} ><div  className='link'>Register</div></Link>
            </div>
            <div>
            <Link to="/login"  style={{ textDecoration: 'none' }}><div  className='link'>Login</div></Link>
            </div>
      </div>
    </div>
  );
}
