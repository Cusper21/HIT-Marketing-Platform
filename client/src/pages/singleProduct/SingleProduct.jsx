import React, { useContext, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

import './singleProduct.scss'

import { makeRequest } from '../../axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';

const SingleProduct = () => {

  window.scrollTo(0,0);

  const queryClient = new useQueryClient()

  const {setChatUser} = useContext(ChatContext)
  const{currentUser} = useContext(AuthContext)
  
  const productId = useParams().id;
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState("image1");

  const { error, isLoading: prodIsLoding ,  data: productInfo } = useQuery(["productInfo", {id:productId}], () =>
    makeRequest.post("/products/product",{id:productId}).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )
    console.log(productInfo)
  const { data: likes } = useQuery(["likes", productId], () =>
    makeRequest.get("/likes/?product_id_wfk="+productId).then((res) => {
      return res.data
    }),
    { networkMode: "offlineFirst" }
  )
  
  const mutation = useMutation(
    (liked) => {
      if (liked)
      return makeRequest.delete('/likes?product_id_wfk='+productId)
      return makeRequest.post('/likes?product_id_wfk='+productId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    },
    { networkMode: "always" }
  )

  const bookmarkMutation = useMutation(
    (bookmarked) => {
      if (bookmarked)
      return makeRequest.delete('/bookmarks?product_id_bfk='+productId)
      return makeRequest.post('/bookmarks?product_id_bfk='+productId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bookmarks"]);
      },
    }
  )

  const { data: bookmarks } = useQuery(["bookmarks", productId], () =>

    makeRequest.get("/bookmarks/?product_id_bfk="+productId).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const handleBookmark = (e) => {
    e.preventDefault()

    bookmarkMutation.mutate(bookmarks.includes(currentUser.id))
  }

  const handleLike = (e) => {
    e.preventDefault()
    mutation.mutate(likes.includes(currentUser.id))
  }

  const createchat = async (vendor)=>{
    await makeRequest.post('/chats/createchat', vendor)
  }

  const handleClick = (product)=>{
    setChatUser({
      user_id:product.vendor_id_pfk,
      user_name:product.vendor_name,
      user_image:product.profile_picture     
    })

    createchat({
      user_id:product.vendor_id_pfk,
      user_name:product.vendor_name,
      user_image:product.profile_picture
    }).then(()=>{
      navigate(`/chat`)
    })
  }

  const handleReport = async(product)=>{
    await makeRequest.post('products/reportproduct', product).then(()=>{
      navigate(-1)
    })
  }

  return (
    <div>
      {error
        ? "Something went wrong."
        :prodIsLoding
        ?"Loading..."
        :productInfo?.map(product=>(
          <div className='singleProduct' key={product.id}>
            <div className="left">

              <div className="images">
                <img src={product.image1} alt="" onClick={(e)=> setSelectedImage("image1")}/>
                <img src={product.image2} alt="" onClick={(e)=> setSelectedImage("image2")}/>
              </div>

              <div className="mainImage">
                <img src={product[selectedImage]} alt="" />
              </div>
            </div>
            
            <div className="right">
              <h2>{product.name}</h2>
              <span className='price'>${product.price}</span>

              <div className="description">
                <h4>Description:</h4>
                <p>{product.description}</p>
              </div>

              <div className="links">
                <div className='likes'>
                  {likes?.includes(currentUser.id)
                  ? <FavoriteRoundedIcon style={{color:"red", height:"20px"}} onClick={handleLike}/>
                  : <FavoriteBorderRounded style={{height:"20px"}} onClick={handleLike}/>}
                  
                </div>
                <div className='bookmarks'>
                {bookmarks?.includes(currentUser.id)
                ? <BookmarkAddedRoundedIcon style={{height:"20px"}} onClick={handleBookmark}/>
                : <BookmarkAddOutlinedIcon style={{height:"20px"}} onClick={handleBookmark}/>}
                </div>
                <FlagRoundedIcon style={{ height:"20px"}} onClick={() => {handleReport(product)}}/>
              
                <Link className='link' to=''>
                  <BalanceRoundedIcon/> Compare
                </Link>
              </div>
              <hr />
              <div className='info'>
                <h4>Product info</h4>
                {product.sub_category_pfk !=='' && <span>Type: {product.sub_category_pfk}</span>}
                {product.size !=='' && <span>Size: {product.size}</span>}
                {product.colors !=='' ? '' : <span>Color: {product.colors}</span>}
                {product.category_pfk !=='' && <span>Category: {product.category_pfk}</span>}
              </div>

              <hr />

              <div className='info'>
                <h4>Vendor info</h4>
                <span>Name: {product.vname}</span>
                <span>Address: {product.address}</span>
                <div className='link1' onClick={() => handleClick(product)}>
                  <ChatOutlinedIcon/> Contact Vendor
                </div>
              </div>
              
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default SingleProduct