import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { makeRequest } from '../../axios';

const CompanyRegistration = () => {

  const [err, setErr] = useState(null)
  const navigate = useNavigate()

  
  const [inputs, setInputs] = useState({
    name:"",
    type:"",
    address:"",
    cell:"",
    username:"",
    email:"",
    password:""
  })

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleClick = async (e)=>{
    e.preventDefault()

    try {
      await makeRequest.post("/auth/registervendor",inputs)
    } catch (err) {

      setErr(err)
    }
  }

  return (
    <div className="right">
      <h2>
        Company Registration
      </h2>

      <div className="input">
        <input type="text" placeholder="Enter Company Name" name='name'  onChange={handleChange}/>
        <input type="text" placeholder="Enter Type" name='type' onChange={handleChange}/>
        <input type="text" placeholder="Enter Address" name='address' onChange={handleChange}/>
        <input type="number" placeholder="Enter Cell" name='cell' onChange={handleChange}/>
        <input type="email" placeholder="Enter Email" name='email' onChange={handleChange}/>
        <input type="text" placeholder="Enter Username" name='username' onChange={handleChange}/>
        <input type="password" placeholder="Enter Password" name='password' onChange={handleChange}/>
        <input type="password" placeholder="Re-Enter Password" name='cpassword' onChange={handleChange}/>

        <span></span>
        <button onClick={handleClick}>
          Register
        </button>

        <div className="links">
          <Link className="link" to="/login">
            Login   
          </Link>
          <Link className="link" to="/registration/">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  )
}

export default CompanyRegistration