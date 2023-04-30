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

      <form className="input" onSubmit={handleClick}>
        <input type="text" placeholder="Enter Company Name" name='name'  required onChange={handleChange}/>
        <input type="text" placeholder="Enter Type" name='type' required onChange={handleChange}/>
        <input type="text" placeholder="Enter Address" name='address' required onChange={handleChange}/>
        <input type="number" placeholder="Enter Cell" name='cell' required onChange={handleChange}/>
        <input type="email" placeholder="Enter Email" name='email' required onChange={handleChange}/>
        <input type="text" placeholder="Enter Username" name='username' required onChange={handleChange}/>
        <input type="password" placeholder="Enter Password" name='password' required onChange={handleChange}/>
        <input type="password" placeholder="Re-Enter Password" name='cpassword' required onChange={handleChange}/>

        <button type='submit'>
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

      </form>
    </div>
  )
}

export default CompanyRegistration