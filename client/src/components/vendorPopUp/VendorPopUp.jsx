import React, { useState } from 'react'
import './vendorPopUp.scss'
import { makeRequest } from '../../axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const VendorPopUp = ({setPopUp, vendor}) => {

  const [inputs, setInputs] = useState({
      name:vendor.name,
      type:vendor.type,
      address:vendor.address,
      cell:vendor.cell,
      email:vendor.email
    })

  const handleChange = (e)=>{
      setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
    }

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users/updatevendor", user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendorprofile"]);
      },
    }
  );

  const handleClick = async (e)=>{
    e.preventDefault()
    await mutation.mutate({...inputs});
    setPopUp(false);
  }

  return (
    <div className='vendorPopUp' onClick={()=>setPopUp(false)}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="right">
          <h2>
            Update
          </h2>

          <div className="input">
            <input type="text" placeholder="Enter Company Name" name='name' value={inputs.name} onChange={handleChange}/>
            <input type="text" placeholder="Enter Type" name='type' value={inputs.type} onChange={handleChange}/>
            <input type="text" placeholder="Enter Address" name='address' value={inputs.address} onChange={handleChange}/>
            <input type="number" placeholder="Enter Cell" name='cell' value={inputs.cell} onChange={handleChange}/>
            <input type="email" placeholder="Enter Email" name='email' value={inputs.email} onChange={handleChange}/>

            <button onClick={handleClick}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorPopUp