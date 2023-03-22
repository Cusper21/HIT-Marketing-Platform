import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from '../../components/card/Card'

import './reportedProducts.scss'

const ReportedProducts = () => {

  const[err,setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const[products,setProducts] = useState([])

    useEffect(()=>{
      const getProducts = async (e)=>{
        try {
          
          const res = await axios.get(`http://localhost:8800/api/products/reported`, {
            withCredentials:true,
          })
          setProducts(res.data)

        } catch (err) {
          setErr(err)
        }
        setLoading(false)
      }
      getProducts()
    })
 

  return (
    <div className='reportedProducts'>
      {err
        ? "Something went wrong"
        : loading 
        ? "loading":products?.map(item=>(
          <Card item = {item} key={item.id}/>
        ))
      }
    </div>
  )
}

export default ReportedProducts