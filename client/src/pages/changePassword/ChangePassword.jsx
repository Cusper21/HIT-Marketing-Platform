import React, { useState } from 'react'
import { makeRequest } from '../../axios'
import './changePassword.scss'

const ChangePassword = () => {

  const [passwords, setPasswords] = useState({});
  const [errors, setErrors] = useState({
    newPassword:'',
    confirmNewPassword:''
  });
  console.log(passwords)

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
      const res = await makeRequest.put("/users/changepassword", passwords).then(()=>{
        alert(res.data)
      })
      } catch (error) {
      const errorMessage = error.response.data;
      alert(errorMessage);
    }

    } else {
      setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    }
  };

  const handleChange = (e) => {
    setPasswords(prev=>({...prev, [e.target.name]:e.target.value}))
    setErrors(prev=>({...prev, [e.target.name]:''}))

  };

  return (
    <div className='changepassword'>
        <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="right">
          <h2>
            Update
          </h2>

          <form className="input">

            <div className="textbox">
              <input type="password" required placeholder="Enter Current Password" name='currentPassword'  onChange={handleChange}/>
              <span className='errorMessage'>{errors.currentPassword ? errors.currentPassword:''}</span>
            </div>
            <div className="textbox">
              <input type="password" required placeholder="Enter New Password" name='newPassword'  onChange={handleChange}/>
              <span className='errorMessage'>{errors.newPassword ? errors.newPassword:''}</span>
            </div>
            <div className="textbox">
              <input type="password" required placeholder="Confirm New Password" name='confirmNewPassword'  onChange={handleChange}/>
              <span className='errorMessage'>{errors.confirmNewPassword ? errors.confirmNewPassword:''}</span>
            </div>

            <button onClick={handleSubmit}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword