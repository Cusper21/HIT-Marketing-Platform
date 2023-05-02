import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { makeRequest } from '../../axios';
import swal from 'sweetalert';

const CompanyRegistration = () => {
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

  const [passwords, setPasswords] = useState({});
  const [errors, setErrors] = useState({
    newPassword:'',
    confirmNewPassword:''
  });

  const handleSubmit = async(event) => {
    event.preventDefault();

    // Password validation rules
    const rules = [
      {
        test: (value) => value !== passwords.currentPassword,
        message: 'New password must be different from current password',
      },
      {
        test: (value) => /[a-z]/.test(value),
        message: 'Password must contain at least one lowercase letter',
      },
      {
        test: (value) => /[A-Z]/.test(value),
        message: 'Password must contain at least one uppercase letter',
      },
      {
        test: (value) => /[0-9]/.test(value),
        message: 'Password must contain at least one number',
      },
      {
        test: (value) => /[!@#$%^&*.]/.test(value),
        message: 'Password must contain at least one special character',
      },
      {
        test: (value) => value.length >= 8,
        message: 'Password must be at least 8 characters long',
      },
    ];

    // Check each password field against the validation rules
    const newErrors = {};
    rules.forEach(({ test, message }) => {
      if (!test(passwords?.newPassword)) {
        newErrors['newPassword'] = message;
      }
    });

    if (passwords?.confirmNewPassword !== passwords?.newPassword) {
      newErrors['confirmNewPassword'] = 'New password and confirm password must match';
    }

    if (Object.keys(newErrors).length === 0) {
      try{
        await makeRequest.post("/auth/registervendor",{ ...inputs, password:passwords.newPassword}).then(()=>{
        swal("Successful!", "User handle created.", "success");
        navigate('/login')
        })

      } catch (error) {
        swal("Failed!", `${error}`, "error")
      }

    } else {
      setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    }
  };

  const handlepChange = (e) => {
    setPasswords(prev=>({...prev, [e.target.name]:e.target.value}))
    setErrors(prev=>({...prev, [e.target.name]:''}))

  };

  const handleKeyPress = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  return (
    <div className="right">
      <h2>
        Company Registration
      </h2>

      <form className="input" onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Company Name" name='name' maxLength={90}  required onChange={handleChange}/>
        <input type="text" placeholder="Enter Type" name='type' maxLength={90} required onChange={handleChange}/>
        <input type="text" placeholder="Enter Address" name='address' maxLength={250} required onChange={handleChange}/>
        <input type="number" placeholder="Enter Cell" name='cell' min={0} maxLength={20} required onChange={handleChange}/>
        <input type="email" placeholder="Enter Email" name='email' maxLength={60} required onChange={handleChange}/>
        <input type="text" placeholder="Enter Username" name='username' maxLength={40} required onKeyPress={handleKeyPress} onChange={handleChange}/>
        <div className="textbox">
              <input type="password" required maxLength={60} placeholder="Enter New Password" name='newPassword' onChange={handlepChange}/>
              <span className='errorMessage'>{errors.newPassword ? errors.newPassword:''}</span>
            </div>
            <div className="textbox">
              <input type="password" required maxLength={60} placeholder="Confirm New Password" name='confirmNewPassword'  onChange={handlepChange}/>
              <span className='errorMessage'>{errors.confirmNewPassword ? errors.confirmNewPassword:''}</span>
            </div>
        

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