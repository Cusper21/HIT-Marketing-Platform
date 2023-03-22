import React, { useContext } from "react";
import "./Cart.scss";
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";


const Bookmarks = () => {

  const{currentUser} = useContext(AuthContext)

  const { data: products } = useQuery(["bookmarks", currentUser.id], () =>

    makeRequest.get("/bookmarks/?product_id_bfk=" + currentUser.id).then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const deleteBookmarks = ()=>{
    
  }
  const deleteBookmark = ()=>{

  }

  return (
    <div className="bookmarks">
      <h1>Products in your cart</h1>
      {products?.map((item) => (
        <Link className="item link" key={item.id} to={`/product/${item.id}`}>
          <img src={`./upload/${item.image1}`} alt="" />
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.desc?.substring(0, 100)}</p>
            <div className="price">
              {item.quantity} x ${item.price}
            </div>
          </div>
          <BookmarkRemoveOutlinedIcon className="deleteBookmark" onClick={() => deleteBookmark(item.id)}/>
        </Link>
      ))}
      
      <span className="deleteBookmarks" onClick={() => deleteBookmarks()}>
        Delete All Bookmarks
      </span>
    </div>
  );
};

export default Bookmarks;
