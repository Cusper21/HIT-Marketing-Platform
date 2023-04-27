import React, { useEffect, useState } from 'react'

import './addProduct.scss'
import {storage} from '../../firebase'
import {v4} from 'uuid'
import { makeRequest } from '../../axios'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

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
  })

  const uploadImages = async () => {

    const image1Ref = ref(storage, `images/${v4() + image1.name}`);
    const image2Ref = ref(storage, `images/${v4() + image2.name}`);

    await uploadBytes(image1Ref, image1).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url1) => {
        console.log(url1)
        setInputs((prev)=>({...prev, image1:url1}))
      });
    })

    await uploadBytes(image2Ref, image2).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url2) => {
        
        setInputs((prev)=>({...prev, image2:url2}))
        console.log(url2)
      });
    })
  };

  useEffect(()=>{

    if(inputs.image1 !== "" && inputs.image2 !== ""){
      makeRequest.post('/products/postproducts', inputs)
      setInputs(
        {
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
        }
      )
    }
  },[inputs])


  const handleFormSubmit = (e) => {
    e.preventDefault()
    uploadImages()
  }
  
  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  return (
    <div className='addProduct'>
      <div className="container">
        
        <div className='catImage'>
          <img src={image1 ? URL.createObjectURL(image1): "../assets/imageBg.png"} alt="Preview" />
          <img src={image2 ? URL.createObjectURL(image2): "../assets/imageBg.png"} alt="Preview" />
        </div>

        <div className="userInfo">

          <form action="/stats" encType="multipart/form-data" method="post" >
            <input type="text" placeholder="Enter Name" name='name' value={inputs.name} onChange={handleChange}/>
            <input type="text" placeholder="Enter Description" name='description' value={inputs.description} onChange={handleChange}/>
            <input type="number" placeholder="Enter Price" name='price' value={inputs.price} onChange={handleChange}/>
            <input type="file" placeholder="Choose main image"name='image1' onChange={(e)=> setImage1(e.target.files[0])}/>
            <input type="file" placeholder="Choose second image" name='image2' onChange={(e)=> setImage2(e.target.files[0])}/>
            <input type="number" placeholder="Enter Size" name='size' value={inputs.size} onChange={handleChange}/>
            <input type="text" placeholder="Enter Colors" name='colors' value={inputs.colors} onChange={handleChange}/>
            <input type="text" placeholder="Enter Quantity" name='quantity' value={inputs.quantity} onChange={handleChange}/>
            <input type="text" placeholder="Enter Category" name='category_pfk' value={inputs.category_pfk} onChange={handleChange}/>
            <input type="text" placeholder="Enter Sub-Category" name='sub_category_pfk' value={inputs.sub_category_pfk} onChange={handleChange}/>

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