import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery} from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import ProductList from '../../components/productList/ProductList'


import './products.scss'

const Products = () => {
 
  const catId = useParams().id;

  const [catFilters,setCatFilters] = useState([])
  const [minPrice,setMinPrice] = useState(0);
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

  const handleMinPriceChange = (e) => {
    const newMinPrice = parseInt(e.target.value);
    if (newMinPrice < maxPrice) {
      setMinPrice(newMinPrice);
    } else {
      setMinPrice(maxPrice);
      setMaxPrice(newMinPrice);
    }
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = parseInt(e.target.value);
    if (newMaxPrice > minPrice) {
      setMaxPrice(newMaxPrice);
    } else {
      setMaxPrice(minPrice);
      setMinPrice(newMaxPrice);
    }
  };


  return (
    <div className='products'>
      <div className="sidebar1">
        
        <div className='filters'>

          <div className='subCategories'>
            <div className="heading">
              <CategoryRoundedIcon className='icon'/>
              <span>Sub-Categories</span>
            </div>
            <div className="scContainer">
            {subCatError
              ? "Something went wrong!"
              :subcategories?.map(subcategory=>(
                <div className="inputItem" key={subcategory.title}>
                  <input type="checkbox" className="checkbox" name="" id={subcategory.title} value={subcategory?.title} onChange={handleChange}/>
                  <label htmlFor={subcategory.title}> {subcategory.title}</label>
                </div>
              ))
            }
            </div>
          </div>

          <div className='price'>

            <div className="filterItem">
            <div className="heading">
                <FilterListRoundedIcon className='icon'/>
                <span>Filter by Price</span>
              </div>
              
              <div className="priceRange">
                <span>{minPrice}</span>
                <div className="range-slider">
                  <input type="range" name="" id="price" min={0} value={minPrice} max={1000} onChange={handleMinPriceChange}/>
                  <input type="range" name="" id="price" min={0} value={maxPrice} max={1000} onChange={handleMaxPriceChange}/>
                </div>
                <span>{maxPrice}</span>
              </div>
            </div>

            <div className="sortItem">
              <div className="heading">
                <SortRoundedIcon className='icon'/>
                <span>Sort by price</span>
              </div>
              
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
              <div className="overlay">
                  <span>{category?.title}</span>
              </div>
            </div>
          ))
        }
        <ProductList catId={catId} sort={sort} minPrice={minPrice} maxPrice={maxPrice}  catFilters={catFilters} key={document.location.href}/>
      </div>
    </div>
  )
}

export default Products