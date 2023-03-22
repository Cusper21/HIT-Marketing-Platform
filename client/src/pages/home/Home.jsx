import React from 'react'

import Slider from '../../components/slider/Slider'
import Spacer from '../../components/spacer/Spacer'
import ProductsTemplate from '../../components/productsTemplate/ProductsTemplate'
import ProductCategories from '../../components/categories/ProductCategories'

import "./home.scss"

const Home = () => {
  window.scrollTo(0,0);
  return (
    <div className='home'>
      <Slider/>
      <Spacer/>
      <ProductsTemplate type='featured'/>
      <Spacer/>
      <ProductCategories/>
      <Spacer/>
      <ProductsTemplate type='popular'/>
      <Spacer/>
    </div>
  )
}

export default Home