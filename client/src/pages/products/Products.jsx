import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery} from '@tanstack/react-query'
import { makeRequest } from '../../axios'

import ProductList from '../../components/productList/ProductList'

import './products.scss'

const Products = () => {

  window.scrollTo(0,0);
 
  const catId = useParams().id;

  const[catFilters,setCatFilters] = useState([])
  const [maxPrice,setMaxPrice] = useState(1000);
  const [sort,setSort] = useState('');

  useEffect(() => {
    setCatFilters([])
    setMaxPrice(0)
  }, [catId]);

  const { error: catError, data: categories } = useQuery(["categories", {title:catId}], () =>
    makeRequest.post("/categories/category", {title:catId}).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const { error: subCatError, data: subcategories } = useQuery(["subcategories", {category_sfk:catId}], () =>
    makeRequest.post("/categories/subcategories", {category_sfk:catId}).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )
  
  const handleChange = (e) => {
    if (e.target.checked) {
      setCatFilters([...catFilters, e.target.value])
    }
    else {
      setCatFilters(catFilters.filter((selectedSubCategory) =>
      selectedSubCategory !== e.target.value
      ))
    }
  };

  return (
    <div className='products'>
      <div className="sidebar">
        
        <div className='filters'>

          <div className='subCategories'>
            <h4>Sub-Categories</h4>
            {subCatError
              ? "Something went wrong!"
              :subcategories?.map(subcategory=>(
                <div className="inputItem" key={subcategory.title}>
                  <input type="checkbox" name="" id={subcategory.title} value={subcategory?.title} onChange={handleChange}/>
                  <label htmlFor={subcategory.title}> {subcategory.title}</label>
                </div>
              ))
            }
          </div>

          <div className='price'>

            <div className="filterItem">
              <h4>Filter by Price</h4>
              <div className="priceRange">
                <span>0</span>
                <input type="range" name="" id="price" min={0} max={1000} onChange={(e)=> setMaxPrice(e.target.value)}/>
                <span>{maxPrice}</span>
              </div>
            </div>

            <div className="sortItem">
              <h4>Sort by price</h4>
              <div className="radioButton">
                <input type="radio" name="radio" id="asc" onChange={(e)=>setSort("asc")}/>
                <label htmlFor="asc">Ascending</label>           
              </div>

              <div className="radioButton">
                <input type="radio" name="radio" id="desc" onChange={(e)=>setSort("desc")}/>
                <label htmlFor="desc">Descending</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {catError
          ? "Something went wrong!"
          :categories?.map(category =>(
            <div className="hero" key={category?.title}>
              <img src={category?.cover_picture} className="catImage" alt="" />
            </div>
          ))
        }
        <ProductList catId={catId} sort={sort} maxPrice={maxPrice} catFilters={catFilters} key={document.location.href}/>
      </div>
    </div>
  )
}

export default Products