import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegistration = () => {

  const [inputs, setInputs] = useState({
    first_name:"",
    last_name:"",
    gender:"",
    date_of_birth:"",
    username:"",
    email:"",
    password:""
  })

  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleClick = async (e)=>{
    e.preventDefault()

    try {

      await axios.post("http://localhost:8800/api/auth/registercustomer",inputs)
      navigate("/login")

    } catch (err) {
      setErr(err)
    }
  }

  console.log(err)

  return (
    <div className="right">
      <h2>
        User Registration
      </h2>

      <form action="">
        <input type="text" placeholder="Enter First Name" name="first_name" onChange={handleChange}/>
        <input type="text" placeholder="Enter Last Name" name="last_name" onChange={handleChange}/>
        <input type="menu" placeholder="Gender" name="gender" onChange={handleChange}/>
        <input type="date" placeholder="Enter D.O.B" name="date_of_birth" onChange={handleChange}/>
        <input type="email" placeholder="Enter Email" name="email" onChange={handleChange}/>
        <input type="text" placeholder="Enter Username" name="username" onChange={handleChange}/>
        <input type="password" placeholder="Enter Password" name="password" onChange={handleChange}/>
        <input type="password" placeholder="Re-Enter Password" name="password" onChange={handleChange}/>

        <div>
          {err && err}
          <button onClick={handleClick}>
            Register
          </button>
        </div>

        <div className="links">
          <Link className="link" to="/login">
            Login
          </Link>

          <Link className="link" to="/registration/company"> 
            Register Company
          </Link>
        </div>

      </form>
    </div>
  )
}

export default UserRegistration