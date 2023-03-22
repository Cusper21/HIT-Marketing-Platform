import React, { useState } from 'react'

import './addProduct.scss'
import { makeRequest } from '../../axios'
import { useMutation} from '@tanstack/react-query'

const AddProduct = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)

  const [inputs, setInputs] = useState({
    name:"",
    description:"",
    price:"",
    image1:"",
    image2:"",
    size:"",
    colors:"",
    quantity:"",
    category_pfk:"",
    sub_category_pfk:"",
    vendor_id_pfk:3
  })

  const mutation = useMutation(
    (filled) => {
      if(filled){
      const formData = new FormData();
      formData.append('fimage', image1);
      formData.append('simage', image2);
      makeRequest.post("/upload", formData).then((res)=>{
        setInputs(prev=>({...prev, image1: res.data.fimage[0].filename, image2: res.data.simage[0].filename}))
      })
      } else {
        console.log('Please choose images')
      }
    },
    {
      onSuccess: async() => {
        await makeRequest.post("products/postproducts", inputs).then((response)=>{
          console.log(response.data)
        })
      },
    }
  )

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    mutation.mutate(image1 && image2)
  }
  
  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  return (
    <div className='addProduct'>
      <div className="container">
        
        <div className='catImage'>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="" />
          <input type="image" name="" id="" alt=''/>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="" />
        </div>

        <div className="userInfo">

          <form action="/stats" encType="multipart/form-data" method="post" >
            <input type="text" placeholder="Enter Name" name='name' onChange={handleChange}/>
            <input type="text" placeholder="Enter Description" name='description' onChange={handleChange}/>
            <input type="number" placeholder="Enter Price" name='price' onChange={handleChange}/>
            <input type="file" placeholder="Choose main image"name='image1' onChange={(e)=> setImage1(e.target.files[0])}/>
            <input type="file" placeholder="Choose second image" name='image2' onChange={(e)=> setImage2(e.target.files[0])}/>
            <input type="number" placeholder="Enter Size" name='size' onChange={handleChange}/>
            <input type="text" placeholder="Enter Colors" name='colors' onChange={handleChange}/>
            <input type="text" placeholder="Enter Quantity" name='quantity' onChange={handleChange}/>
            <input type="text" placeholder="Enter Category" name='category_pfk' onChange={handleChange}/>
            <input type="text" placeholder="Enter Sub-Category" name='sub_category_pfk' onChange={handleChange}/>

            <button onClick={handleFormSubmit}>
              Upload
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default AddProduct