import React, { useContext, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import './singleProduct.scss'

import { makeRequest } from '../../axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';
import swal from 'sweetalert';

const SingleProduct = () => {

  window.scrollTo(0,0);

  const queryClient = new useQueryClient()

  const {setChatUser} = useContext(ChatContext)
  const{currentUser} = useContext(AuthContext)
  
  const productId = useParams().id;
  const navigate = useNavigate();


  const [selectedImage, setSelectedImage] = useState("image1");

    const [showMore, setShowMore] = useState(false);
    const [clicked, setClicked] = useState(false);
    
    const toggleShowMore = () => {
      setShowMore(!showMore);
      setClicked(!clicked);
    };

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
    try {
      bookmarkMutation.mutate(bookmarks.includes(currentUser.id))
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const handleLike = (e) => {
    e.preventDefault()
    try {
      mutation.mutate(likes.includes(currentUser.id))
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const createchat = async (vendor)=>{
    try {
      await makeRequest.post('/chats/createchat', vendor)
    } catch (error) {
      swal("",`${error}`,"error")
    }
  }

  const handleClick = (product)=>{
    setChatUser({
      user_id:product.vendor_id_pfk,
      user_name:product.vname,
      user_image:product.profile_picture     
    })

    createchat({
      user_id:product.vendor_id_pfk,
      user_name:product.vname,
      user_image:product.profile_picture
    }).then(()=>{
      navigate(`/chat`)
    })
  }

  const handleReport = async(product)=>{

    try {
      await makeRequest.post('products/reportproduct', product).then(()=>{
        navigate(-1)
      })
      swal("","Product Restored", 'info')
    } catch (error) {
      swal("",`${error}`,"error")
    }
    
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
                {
                  product.description.length > 100
                  ? <p> {!showMore 
                    ? <p>{ product.description.substring(0, 100)}...<a href={(e)=>{e.preventDefault()}} onClick={toggleShowMore}>read more</a></p> 
                  :<p>{ product.description} <a href={(e)=>{e.preventDefault()}} onClick={toggleShowMore}>read less</a></p>}</p>
                  :<p>{product.description}</p>
                }
                
              </div>
              {(currentUser.id.includes('C') )
              ? <div className="links">
                <div className='item'>
                  {likes?.includes(currentUser.id)
                  ? <FavoriteRoundedIcon style={{color:"red", height:"20px"}} onClick={handleLike}/>
                  : <FavoriteBorderRounded style={{height:"20px"}} onClick={handleLike}/>}
                  
                </div>
                <div className='item'>
                {bookmarks?.includes(currentUser.id)
                ? <BookmarkAddedRoundedIcon style={{height:"20px"}} onClick={handleBookmark}/>
                : <BookmarkAddOutlinedIcon style={{height:"20px"}} onClick={handleBookmark}/>}
                </div>
                <div className="item">
                <FlagRoundedIcon style={{ height:"20px"}} onClick={() => {handleReport(product)}}/>
                </div>
              </div> : ''}

              <div>
              <Divider className='divider' style={{  }}>
                <Chip label='Product Information' />
              </Divider>
              </div>
              <div className='info'>
                {product.sub_category_pfk !=='' && <span>Type: {product.sub_category_pfk}</span>}
                {product.size !=='' && <span>Size: {product.size}</span>}
                {product.colors !=='' && <span>Color: {product.colors}</span>}
                {product.category_pfk !=='' && <span>Category: {product.category_pfk}</span>}
              </div>
              <div>
                <Divider className='divider' style={{  }}>
                  <Chip label='Vendor Information' />
                </Divider>
              </div>

              <div className='info'>
                <span>Name: {product.vname}</span>
                <span>Address: {product.address}</span>
                {(currentUser?.id.includes('C')|| currentUser.id.includes('A')) ? 
                <div className='link1' onClick={() => handleClick(product)}>
                  <ChatOutlinedIcon/> Contact Vendor
                </div> : ''}
              </div>
              
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default SingleProduct