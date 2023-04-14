import React, { useContext } from 'react'
import { useQuery} from '@tanstack/react-query'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './compare.scss'
import { SearchContext } from '../../context/searchContext'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Card from '../card/Card';
import { makeRequest } from '../../axios';
import { CompareContext } from '../../context/compareContext';

const Compare = () => {

    const {setPopUp} = useContext(CompareContext)

    const {searchText, setSearchText} = useContext(SearchContext)

    const { error: productError, isLoading, data: products } = useQuery(["products"], () =>

    makeRequest.get("/products/").then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

    const filteredProducts = products?.filter((item) =>
        searchText ? item.name.toLowerCase().indexOf(searchText) !== -1 : products
    )

    const handleChange = (e)=>{
        setSearchText(e.target.value.toLowerCase())
      }

      function clearInput(){
        document.getElementById("search").value = '';
        setSearchText(null);
      }

  return (
    <div className='compare' onClick={()=>{setSearchText(); setPopUp(false)}}>
        <CloseRoundedIcon className='close' onClick={()=>{setSearchText(); setPopUp(false)}}/>
      <div className="container">
        <div className="item">
            <SearchRoundedIcon/>
            <input type="text" placeholder='Search' id='search' onChange={handleChange} />
            <ClearRoundedIcon onClick={clearInput}/>
        </div>

        <div className="cProducts">
          
        {productError
        ? <span>Something went wrong</span>
        :isLoading
        ? <span>Loading...</span>
        :filteredProducts?.map(item=>(
          <Card item = {item} key={item.id}/>
        ))
        }
        </div>
      </div>
    </div>
  )
}

export default Compare