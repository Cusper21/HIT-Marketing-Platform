import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import "./navbar.scss"

import { AuthContext } from "../../context/authContext";
import { SearchContext } from '../../context/searchContext';

const debounce = (fn) => {
  let frame;

  return (...params) => {

    if (frame) { 
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(() => {
      fn(...params);
    });

  }

};

const storeScroll = () => {
  document.documentElement.dataset.scroll = window.scrollY;
}

document.addEventListener('scroll', debounce(storeScroll), { passive: true });
storeScroll();

const Navbar = () => {

  const {setSearchText} = useContext(SearchContext)

  const handleChange = (e)=>{
    setSearchText(e.target.value.toLowerCase())
  }

  const {currentUser} = useContext(AuthContext)
  const[categories,setCategories] = useState([])
  
  useEffect(()=>{
    
    const getCategories = async (e)=>{
  
      try {
        const res = await axios.get(`http://localhost:8800/api/categories/all`)
        setCategories(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getCategories()
  })

  function clearInput(){
    document.getElementById("search").value = '';
    setSearchText(null);
  }

  return (
    <div className="navbar">
      <div className="wrapper">

        <div className="left">
          
          <Link className="link" to="/">
            <span>HMP</span>
          </Link>

          {categories?.map(
              category =>(
                <Link className="link" to={`/products/${category.title}`} key={category.title}>{category.title}</Link>
              )
            )
          }
        </div>

        <div className="center">
          {!window.location.pathname.includes('/products/')
            ? ''
            :<div className="item">
              <SearchRoundedIcon/>
              <input type="text" placeholder='Search' id='search' onChange={handleChange} />
              <ClearRoundedIcon onClick={clearInput}/>
            </div>
          }
        </div>

        <div className="right">

          <Link className="link" to={`/chat/${currentUser.id}`}>
            <ChatOutlinedIcon/>
            <span>0</span>
          </Link>

          <Link className="link" to="/wishlist">
            <BookmarkAddOutlinedIcon/>
            <span>0</span>
          </Link>

          <Link className="link" to={`/up/${currentUser.id}`}>
            <div className="navProfile">
              <img src={currentUser.profile_picture} alt="" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Navbar