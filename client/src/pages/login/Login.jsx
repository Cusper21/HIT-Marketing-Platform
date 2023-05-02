import "./login.scss"
import swal from 'sweetalert';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Login = () => {

  const {login} = useContext(AuthContext)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [inputs, setInputs] = useState({
    username:"",
    password:""
  })

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      swal({
        title: 'Logging in...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        onOpen: () => {
          swal.showLoading();
        },
      });
  
      await login(inputs);
  
      swal.close();
      navigate('/');
    } catch (err) {
      swal('',`Incorrect Username or Password!`,'error')

    }
  };

  const handleKeyPress = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  return (
    <div className="login">
      <div className="lgcard">

        <div className="left">
          <h1>
            HIT Marketing Platform.
          </h1>
          <Link className="link" to="/registration/">
              Create Account
          </Link>
          <Link className="link" to="/registration/company"> 
              Register Company
          </Link>
        </div>

        <div className="lgright">
          <h2>
            Login
          </h2>

          <form onSubmit={handleLogin}>
            <input maxLength={64} required type="text" placeholder="Enter Username" name="username" onChange={handleChange}/>
            <input maxLength={64} required type={showPassword ? 'text' : 'password'} placeholder="Enter Password" name="password" onChange={handleChange} onKeyPress={handleKeyPress}/>
            <FormControlLabel control={<Checkbox checked={showPassword} onChange={handleTogglePassword} size="small"/>} label="Show password" />
            <button type="submit" >Login </button>
          </form>

        </div>

      </div>
    </div>
  )
}

export default Login