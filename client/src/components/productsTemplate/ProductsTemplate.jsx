import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Card from '../card/Card.jsx'

import './productsTemplate.scss'

const ProductsTemplate = ({type}) => {

  const[err,setErr] = useState(null)
  const[loading,setLoading] = useState(true)
  const[products,setProducts] = useState([])
  
  useEffect(()=>{

    const getProducts = async (e)=>{
      try {

        const res = await axios.get(`http://localhost:8800/api/products/${type}`)
        setProducts(res.data)

      } catch (err) {
        setErr(err)
      }

      setLoading(false)
    }
    
    getProducts()
  },[type,setProducts])

  return (
    <div className='productsTemplate'>

      <div className="top">
        <h1>{type} Products</h1>
      </div>

      <div className="bottom1">
        {err
          ? "Something went wrong!"
          :loading
          ? "Loading..."
          :products.map(item =>(
            <Card item={item} key={item.id}/>
          ))
        }
      </div>

    </div>
  )
}

export default ProductsTemplate