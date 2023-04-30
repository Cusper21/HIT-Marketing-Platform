import React, { useEffect, useState } from 'react'

import Card from '../../components/card/Card'
import UpdateProducts from '../../components/updateProducts/UpdateProducts'
import './manageProducts.scss'
import { makeRequest } from '../../axios'

const ManageProducts = () => {

  const[err,setErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const[products,setProducts] = useState([])
  const [open, setOpen] = useState(false);

  useEffect(()=>{

    const getProducts = async (e)=>{
      
      try {

        const res = await makeRequest.get(`/products/vendor`)
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
          <div key={item.id}>
            <Card item = {item} setOpen={setOpen}/>
            {open && <UpdateProducts setOpen={setOpen} item={item}/>}
          </div>
        ))
      }
    </div>
  )
}

export default ManageProducts