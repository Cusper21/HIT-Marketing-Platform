import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import "./userRegistraion.scss"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height:400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius:5
};

const UserRegistration = () => {

  const [inputs, setInputs] = useState({
    first_name:"",
    last_name:"",
    gender:"",
    date_of_birth:"",
    username:"",
    email:"",
    password:"",
    preferences:[]
  })
  const navigate = useNavigate()
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [passwords, setPasswords] = useState({});
  const [errors, setErrors] = useState({
    newPassword:'',
    confirmNewPassword:''
  });

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

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
        const preferencesStr = JSON.stringify(inputs.preferences);   
        await makeRequest.post("/auth/registercustomer",{ ...inputs,preferences: preferencesStr, password:passwords.newPassword}).then(()=>{
        swal("Successful!", "User handle created.", "success");
        navigate("/login")
        })

      } catch (error) {
        swal("Failed!", `${error.response.data}`, "error")
      }

    } else {
      setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    }
  };

  const handlepChange = (e) => {
    setPasswords(prev=>({...prev, [e.target.name]:e.target.value}))
    setErrors(prev=>({...prev, [e.target.name]:''}))

  };

  const { error: subCatError, data: subcategories } = useQuery(["subcategories"], () =>
    makeRequest.get("/categories/", ).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleCheckboxChange = (e) => {
      setInputs(prev=>({
        ...prev, 
        preferences: e.target.checked
        ?[...inputs.preferences, e.target.value]
        :inputs.preferences.filter((selectedSubCategory) =>selectedSubCategory !== e.target.value)
      }))
  };

  const handleKeyPress = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  return (
    <div className="right" id="right">
      <h2>
        User Registration
      </h2>

      <form className="input">
        <input type="text" placeholder="Enter First Name" maxLength={40} name="first_name" required onChange={handleChange}/>
        <input type="text" placeholder="Enter Last Name" maxLength={40} name="last_name" required onChange={handleChange}/>
        <select name="gender" required value={inputs.gender} onChange={handleChange}>
        <option value="" disabled>Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
        <input type="date" placeholder="Enter D.O.B" name="date_of_birth" max={maxDate.toISOString().split('T')[0]} required onChange={handleChange}/>
        <input type="email" maxLength={60} placeholder="Enter Email" name="email" required onChange={handleChange}/>
        <input type="text" maxLength={40} placeholder="Enter Username" name="username" required onKeyPress={handleKeyPress} onChange={handleChange}/>
        <div className="textbox">
              <input type="password" required maxLength={60} placeholder="Enter New Password" name='newPassword'  onChange={handlepChange}/>
              <span className='errorMessage'>{errors.newPassword ? errors.newPassword:''}</span>
            </div>
            <div className="textbox">
              <input type="password" required maxLength={60} placeholder="Confirm New Password" name='confirmNewPassword'  onChange={handlepChange}/>
              <span className='errorMessage'>{errors.confirmNewPassword ? errors.confirmNewPassword:''}</span>
            </div>
        <div>
          <button onClick={handleSubmit}>
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

      <div>
        <Button onClick={handleOpen}>Choose Preferences</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="box">
          
        <div className="heading">
          <span>Sub-Categories</span>
        </div>
        <div className='subCategories'>
            
          <div className="scContainer">
          {subCatError
            ? "Something went wrong!"
            :subcategories?.map(subcategory=>(
              <div className="inputItem" key={subcategory.title}>
                <input type="checkbox" className="checkbox" name="" id={subcategory.title} value={subcategory?.title} onChange={handleCheckboxChange}/>
                <label htmlFor={subcategory.title}> {subcategory.title}</label>
              </div>
            ))
          }
          </div>
        </div>
        </Box>
      </Modal>
    </div>
    </div>
  )
}

export default UserRegistration