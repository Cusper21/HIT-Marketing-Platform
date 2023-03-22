import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import './productCategories.scss'

const ProductCategories = () => {

  const[err,setErr] = useState(null)
  const[loading,setLoading] = useState(true)
  const[categories,setCategories] = useState([])
  
  useEffect(()=>{

    const getCategories = async (e)=>{
      try {
        
        const res = await axios.get(`http://localhost:8800/api/categories/all`)
        setCategories(res.data)

      } catch (err) {
        setErr(err)
      }

      setLoading(false)
    }

    getCategories()
  })

  return (
    <div className='productCategories'>
        <h1>Categories</h1>
        <div className="container">
          {err
            ? "Something went wrong!"
            :loading
            ? "Loading..."
            :categories?.map(category =>(
              <Link className='link' to={`/products/${category.title}`} key={category.title}>
                <img src={category.cover_picture} alt="" />
                <div className="overlay">
                  <button>{category.title}</button>
                </div>
              </Link>
            ))
          }
        </div>
    </div>
  )
}

export default ProductCategories