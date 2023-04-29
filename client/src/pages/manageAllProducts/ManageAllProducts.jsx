import React from 'react'
import './manageAllProducts.scss'
import { makeRequest } from '../../axios'
import { useQuery } from '@tanstack/react-query'
import Card from '../../components/card/Card'

const ManageAllProducts = () => {
  const { error, isLoading, data: products } = useQuery(["allproducts"], () =>

  makeRequest.get("/products/all").then((res) => {
    return res.data
  }),
  { networkMode: "always" }
  )
  
  return (
    <div className='manageAllProducts'>
      {error
        ? "Something Went Wrong"
        :isLoading ? "loading"
        :products?.map(item=>(
          <Card item = {item} key={item.id}/>
        ))
      }
    </div>
  )
}

export default ManageAllProducts