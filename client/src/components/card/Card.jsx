import React, { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

import {AuthContext} from './../../context/authContext';
import { makeRequest } from '../../axios.js';
import moment from "moment"

import './card.scss'
import { CompareContext } from '../../context/compareContext';

const Card = ({item}) => {

  const{currentUser} = useContext(AuthContext)
  const {setProduct1,setProduct2,product1,product2,setPopUp} = useContext(CompareContext)

  const queryClient = new useQueryClient()

  const likeMutation = useMutation(
    (liked) => {
      if (liked)
      
      return makeRequest.delete('/likes?product_id_wfk='+item.id)
      return makeRequest.post('/likes?product_id_wfk='+item.id)
      
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  )

  const bookmarkMutation = useMutation(
    (bookmarked) => {
      if (bookmarked)
      return makeRequest.delete('/bookmarks?product_id_bfk='+item.id)
      return makeRequest.post('/bookmarks?product_id_bfk='+item.id)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bookmarks"]);
      },
    }
  )

  const { data: likes } = useQuery(["likes", item.id], () =>

    makeRequest.get("/likes/?product_id_wfk="+item.id).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const { data: bookmarks } = useQuery(["bookmarks", item.id], () =>

    makeRequest.get("/bookmarks/?product_id_bfk="+item.id).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const handleLike = (e) => {
    e.preventDefault()
    console.log(item)
    likeMutation.mutate(likes.includes(currentUser.id))
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    bookmarkMutation.mutate(bookmarks.includes(currentUser.id))
  }

  const[err, setErr] = useState(null)
  const[inputs] = useState({
    id: item.id
  })

  const handleDelete = async (e)=>{
    e.preventDefault()

    try {
      makeRequest.get( `products/delete`,inputs)
    } catch (error) {
      setErr(error)
    }
    console.log(err)
  }

  const handleAdd =(e)=>{
    e.preventDefault()
    if (!product1) {
      setProduct1(item)
    }else if(!product2){
      setProduct2(item)
    }
    setPopUp(false)
  }

  const reportMutation = useMutation(
    (reported) => {
      if (reported)
      console.log(item)
      return makeRequest.post('products/reportproduct', item)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
      },
    }
  )

  const handleReport =(e)=>{
    e.preventDefault()
    reportMutation.mutate(item)
  }

  return (
    <Link className='link' to={`/product/${item.id}`}>
      <div className='card'>
        <div className="image">
          {moment(Date.now()).diff(moment(item.date_added), 'days', true) <= 2 ? <span>New</span> : null}
          <img src={item.image1} alt="" className='mainImg'/>
        </div>
        <h3>{item.name}</h3>
        <div className="prices">
          <h3>${item.price} </h3>
          
        </div>
        
        {(window.location.pathname === '/' || window.location.pathname.includes('/products')) && 
        <div className='bottom'>
          <div className='likes'>
            {likes?.includes(currentUser.id)
            ? <FavoriteRoundedIcon style={{color:"red", height:"20px"}} onClick={handleLike}/>
            : <FavoriteBorderRounded style={{height:"20px"}} onClick={handleLike}/>}
            {likes?.length}
          </div>
          
          <div className='bookmarks'>
            {bookmarks?.includes(currentUser.id)
            ? <BookmarkAddedRoundedIcon style={{height:"20px"}} onClick={handleBookmark}/>
            : <BookmarkAddOutlinedIcon style={{height:"20px"}} onClick={handleBookmark}/>}
          </div>

          <FlagRoundedIcon style={{ height:"20px"}} onClick={handleReport}/>
        </div>
        }

        {(window.location.pathname.includes('/manage') || window.location.pathname.includes('/reported')) &&
          <div className='buttons2'>
            <button>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        }

        {window.location.pathname.includes('/compare') &&
          <div className='buttons2'>
            <button onClick={handleAdd}>add</button>
          </div>
        }
      </div>
    </Link>
  )
}

export default Card