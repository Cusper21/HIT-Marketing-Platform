import React, { useEffect, useState } from 'react'

import Card from '../../components/card/Card'

import './manageProducts.scss'
import { makeRequest } from '../../axios'

const ManageProducts = () => {

  const[err,setErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const[products,setProducts] = useState([])

  useEffect(()=>{

    const getProducts = async (e)=>{
      
      try {

        const res = await makeRequest.get(`http://localhost:8800/api/products/vendor`, {
          withCredentials:true
        })
        setProducts(res.data)
        
      } catch (err) {
        setErr(err.response.data)
      }

      setLoading(false)
    }

    getProducts()
  })
 
  return (
    <div className='manageProducts'>
      {err
        ? "Something Went Wrong"
        :loading ? "loading"
        :products?.map(item=>(
          <Card item = {item} key={item.id}/>
        ))
      }
    </div>
  )
}

export default ManageProducts