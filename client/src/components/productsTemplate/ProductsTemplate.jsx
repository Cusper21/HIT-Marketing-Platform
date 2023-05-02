import React from 'react'
import swal from 'sweetalert'

import Card from '../card/Card.jsx'

import './productsTemplate.scss'
import { makeRequest } from '../../axios.js'
import { useQuery } from '@tanstack/react-query'

const ProductsTemplate = ({type}) => {

  const { isLoading, error, data: products } = useQuery(["homeProducts", type], () =>

    makeRequest.get(`/products/${type}`).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )
  
  return (
    <div className='productsTemplate'>

      <div className="top">
        <h1>{type} Products</h1>
      </div>

      <div className="bottom1">
        {error
          ? swal("", "Something Went Wrong", "error")
          :isLoading
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