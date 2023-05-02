import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

import './footer.scss'
import axios from 'axios';

const Footer = () => {

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

  return (
    <div className='footer'>
      <div className='top'>

        <div className='item'>
          <h2>Categories</h2>
          {categories?.map(
              category =>(
                <Link className="link" to={`./products/${category.title}`} key={category.title}>{category.title}</Link>
              )
            )
          }
        </div>

        <div className='item'>
          <h2>Links</h2>
          <Link className='link' to={`/compare`}>Compare Products</Link>
          <Link className='link' to=''>Privacy</Link>
          <Link className='link' to=''>User Manual</Link>
          <Link className="link" to=''>Sales Terms</Link>
        </div>

        <div className='item'>
          <h2>About Us</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae tempora cum atque suscipit. Id, ipsam? Reprehenderit quisquam placeat quaerat natus quas cupiditate assumenda nesciunt deleniti in eveniet tempora distinctio, ex, temporibus aperiam eius quibusdam id?
          </p>
        </div>

        <div className='item'>
          <h2>Location</h2>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae tempora cum atque suscipit. Id, ipsam? Reprehenderit quisquam placeat quaerat natus quas cupiditate assumenda nesciunt deleniti in eveniet tempora distinctio, ex, temporibus aperiam eius quibusdam id?
          </p>
        </div>
      </div>
      <div className='bottom'>

        <div className="left">
          <Link className="link" to='./'>HIT Marketing Platform</Link>
          <span>   &copy; Copyright 2023. All rights reserved.</span>
        </div>

        <div className="right">

          <Link className='link' to=''>
            <TwitterIcon/>
          </Link>

          <Link className='link' to=''>
            <YouTubeIcon/>
          </Link>

          <Link className='link' to=''>
            <InstagramIcon/>
          </Link>

          <Link className='link' to=''>
            <FacebookIcon/>
          </Link>

        </div>
      </div>

    </div>
  )
}

export default Footer