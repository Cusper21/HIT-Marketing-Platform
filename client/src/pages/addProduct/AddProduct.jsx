import React, { useContext, useEffect, useState } from 'react'

import './addProduct.scss'
import {storage} from '../../firebase'
import {v4} from 'uuid'
import { makeRequest } from '../../axios'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { CategoriesContext} from '../../context/categoriesContext'

const AddProduct = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)

  const {cat,scat, categories, subCategories} = useContext(CategoriesContext)
  
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

  cat()
  if(inputs.category_pfk !== ""){
    scat({category_sfk:inputs.category_pfk})
  }

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
    if(!image1 || !image2){
      alert('Choose Both Images')
    }else{
      try {
        uploadImages().then(()=>{
          alert('Product Upload Successful')
        })
      } catch (error) {
        alert('error')
      }
    }
  }
  
  const handleChange = (e)=>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  return (
    <div className='addProduct'>
      <div className="container">
        
        <div className='catImage'>
          <div className="imgContainer">
            <img src={image1 ? URL.createObjectURL(image1): "../assets/imageBg.png"} alt="Preview" />
            <input type="file" className='file' placeholder="Choose main image"name='image1' onChange={(e)=> setImage1(e.target.files[0])}/>
          </div>
          <div className="imgContainer">
            <img src={image2 ? URL.createObjectURL(image2): "../assets/imageBg.png"} alt="Preview" />
            <input type="file" className='file' placeholder="Choose second image" name='image2' onChange={(e)=> setImage2(e.target.files[0])}/>
          </div>
        </div>

        <div className="userInfo" >

          <form onSubmit={handleFormSubmit} >
            <input type="text" placeholder="Enter Name" name='name' value={inputs.name} required onChange={handleChange}/>
            <input type="text" placeholder="Enter Description" name='description' value={inputs.description} required onChange={handleChange}/>
            <input type="number" placeholder="Enter Price" name='price' value={inputs.price} required onChange={handleChange}/>
            <input type="text" placeholder="Enter Size" name='size' value={inputs.size} onChange={handleChange}/>
            <input type="text" placeholder="Enter Colors" name='colors' value={inputs.colors} onChange={handleChange}/>
            <input type="text" placeholder="Enter Quantity" name='quantity' value={inputs.quantity} required onChange={handleChange}/>
            <select name="category_pfk" value={inputs.category_pfk} required onChange={handleChange}>
            <option value="" disabled>Select Category</option>
              {categories?.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
            </select>
            <select name='sub_category_pfk' value={inputs.sub_category_pfk} required onChange={handleChange}>
            <option value="" disabled>Select Sub Category</option>
            {subCategories?.map((option) => (
                <option key={option.title} value={option.title}>
                  {option.title}
                </option>
              ))}
            </select>

            <button type='submit' >
              Upload
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default AddProduct