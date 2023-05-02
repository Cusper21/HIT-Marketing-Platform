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
import swal from 'sweetalert'

import './card.scss'
import { CompareContext } from '../../context/compareContext';

const Card = ({item, setOpen}) => {

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
    try {
      likeMutation.mutate(likes.includes(currentUser.id))
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    bookmarkMutation.mutate(bookmarks.includes(currentUser.id))
  }

  const[inputs] = useState({
    id: item.id
  })

  const handleDelete = async (e)=>{
    e.preventDefault()

    try {
      await makeRequest.post( `/products/delete`,inputs)
      swal("","Product Deleted", 'info')
      await queryClient.refetchQueries({ queryKey: ['allproducts']})
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const handleRestore = async (e)=>{
    e.preventDefault()

    try {
      await makeRequest.post( `/products/restore`,inputs)
      swal("","Product Restored", 'info')
      await queryClient.refetchQueries({ queryKey: ['allproducts']})
    } catch (error) {
      swal("",`${error}`,"error")
    }
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
      return makeRequest.post('products/reportproduct', item)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
        queryClient.refetchQueries({ queryKey: ["homeProducts"]})
      },
    }
  )

  const handleReport =(e)=>{
    e.preventDefault()
    try {
      reportMutation.mutate(item)
      swal("","Product Restored", 'info')
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const handlePopUp =(e)=>{
    e.preventDefault()
    setOpen(true)
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
        
        {((window.location.pathname === '/' || window.location.pathname.includes('/products')) && currentUser.id.includes('C')) && 
        <div className='bottom'>
          <div className='item'>
            {likes?.includes(currentUser.id)
            ? <FavoriteRoundedIcon style={{color:"#ff1744", height:"20px"}} onClick={handleLike}/>
            : <FavoriteBorderRounded style={{height:"20px"}} onClick={handleLike}/>}
            {likes?.length}
          </div>
          <div className='item'>
            {bookmarks?.includes(currentUser.id)
            ? <BookmarkAddedRoundedIcon style={{height:"20px"}} onClick={handleBookmark}/>
            : <BookmarkAddOutlinedIcon style={{height:"20px"}} onClick={handleBookmark}/>}
          </div>
          <div className="item">
            <FlagRoundedIcon style={{ height:"20px"}} onClick={handleReport}/>
          </div>
          
        </div>
        }

        {(window.location.pathname.includes('/manage') || window.location.pathname.includes('/reported')) &&
          <div className='buttons2'>
            {currentUser.id === 'Admin'
            ? <div className="restore">
              {item.product_id_rfk ? <button onClick={handleRestore}>Restore</button> :''}
              </div> 
            :<button onClick={handlePopUp}>Update</button>}
            
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