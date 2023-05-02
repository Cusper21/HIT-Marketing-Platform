import React, { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

import Card from '../card/Card'

import './productList.scss'
import { makeRequest } from '../../axios'
import { SearchContext } from '../../context/searchContext'
import { AuthContext } from '../../context/authContext'

const ProductList = ({catId, catFilters,minPrice, maxPrice, sort}) => {

  const {searchText} = useContext(SearchContext)
  const {currentUser} = useContext(AuthContext)

  const { error: productError, isLoading, data: products } = useQuery(["products", {category_pfk:catId}], () =>

    makeRequest.post("/products/", {category_pfk:catId}).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const catfilter = products?.filter((item) =>
    catFilters?.length > 0
      ? catFilters?.some((filterTag) =>
          item.sub_category_pfk === filterTag
        )
      : products 
  )

  const priceFilter = catfilter?.filter((item) =>
    maxPrice !== 0 ? item.price >= minPrice && item.price <= maxPrice : catFilters
  )

  const filteredProducts = priceFilter?.filter((item) =>
    searchText ? item.name.toLowerCase().indexOf(searchText) !== -1 : priceFilter
  )

  const dateSortedProducts = filteredProducts?.sort((x,y) =>
     { return new Date(y.date_added)  - new Date(x.date_added)
    }
  )
  
  const priceSort = dateSortedProducts?.sort((x,y) =>
     {if(sort === 'asc')
      return x.price - y.price
      else if(sort === 'desc')
      return y.price - x.price
      else return filteredProducts
    }
  )
  
  const pref = currentUser.preferences ? JSON.parse(currentUser.preferences) : []
  const favoriteData = priceSort?.filter((item) => pref.includes(item.sub_category_pfk)) || []
  // filter the data to get items NOT in the user's favorite categories
  const nonFavoriteData = priceSort?.filter((item) => !pref.includes(item.sub_category_pfk)) || []

  // combine the favorite and non-favorite data arrays, randomizing the order of the favorites
  const randomizedFavorites = favoriteData.sort(() => 0.5 - Math.random())
  const sortedData = [...randomizedFavorites, ...nonFavoriteData]

     
  return (
    <div className='productList'>
      {productError
        ? <span>Something went wrong</span>
        :isLoading
        ? <span>Loading...</span>
        :sortedData?.map(item=>(
          <Card item = {item} key={item.id}/>
        ))
      }
    </div>
  )
}

export default ProductList