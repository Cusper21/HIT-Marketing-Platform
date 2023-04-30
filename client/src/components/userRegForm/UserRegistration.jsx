import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import axios from "axios";
import "./userRegistraion.scss"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

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

  Modal.setAppElement(document.getElementById('right'))

  console.log(inputs)

  const { error: subCatError, data: subcategories } = useQuery(["subcategories"], () =>
    makeRequest.post("/categories/", ).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const [err, setErr] = useState(null)
  const navigate = useNavigate()
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  const handleClick = async (e)=>{
    e.preventDefault()

    try {
      const preferencesStr = JSON.stringify(inputs.preferences);
      await axios.post("http://localhost:8800/api/auth/registercustomer",{
        ...inputs,
        preferences: preferencesStr
      })
      navigate("/login")

    } catch (err) {
      setErr(err)
    }
  }

  const handleCheckboxChange = (e) => {
   
      setInputs(prev=>({
        ...prev, 
        preferences: e.target.checked
        ?[...inputs.preferences, e.target.value]
        :inputs.preferences.filter((selectedSubCategory) =>selectedSubCategory !== e.target.value)
      }))
  };

  return (
    <div className="right" id="right">
      <h2>
        User Registration
      </h2>

      <form className="input" onSubmit={handleClick}>
        <input type="text" placeholder="Enter First Name" name="first_name" required onChange={handleChange}/>
        <input type="text" placeholder="Enter Last Name" name="last_name" required onChange={handleChange}/>
        <input type="menu" placeholder="Gender" name="gender" required onChange={handleChange}/>
        <input type="date" placeholder="Enter D.O.B" name="date_of_birth" required onChange={handleChange}/>
        <input type="email" placeholder="Enter Email" name="email" required onChange={handleChange}/>
        <input type="text" placeholder="Enter Username" name="username" required onChange={handleChange}/>
        <input type="password" placeholder="Enter Password" name="password" required onChange={handleChange}/>
        <input type="password" placeholder="Re-Enter Password" name="password" required onChange={handleChange}/>

        <div>
          <button type="submit">
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

        <button onClick={handleModal}>Close Modal</button>

      </form>

      <Modal isOpen={isModalOpen} onRequestClose={handleModal}>
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
        <button onClick={handleModal}>Close Modal</button>
      </Modal>

    </div>
  )
}

export default UserRegistration