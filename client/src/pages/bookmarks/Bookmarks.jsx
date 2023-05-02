import React, { useContext } from "react";
import "./bookmarks.scss";
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import swal from "sweetalert";


const Bookmarks = () => {

  const{currentUser} = useContext(AuthContext)

  const queryClient = new useQueryClient()

  const { data: products } = useQuery(["bookmarks", currentUser.id], () =>

    makeRequest.get("/bookmarks/userbookmarks").then((res) => {
      return res.data
    }),
    { networkMode: "always" }
  )

  const deleteBookmark = async (e,productId)=>{
    e.preventDefault();

    try {
      await makeRequest.delete('/bookmarks?product_id_bfk='+productId)
      .then(()=>{
        queryClient.invalidateQueries(["bookmarks"]);
      })
    } catch (error) {
      swal('',`Something Went Wrong!`,'error')
    }
    
  }

  const deleteBookmarks = (e)=>{
    
  }

  return (
    <div className="bookmarks">
      <div className="topbar">
        <h2>My Bookmarks</h2>
        <span className="deleteBookmarks" onClick={() => deleteBookmarks()}>
          Delete All
        </span>
      </div>
      <div className="bcontainer">

        {products?.map((item) => (
          <Link className="item link" key={item.id} to={`/product/${item.id}`}>
            <div className="bleft">
              <img src={item.image1} alt="" />
              <div className="details">
                <h3>{item.name}</h3>
                <div className="price">
                  ${item.price}
                </div>
                {item.colour && <p>{item.colour}</p>}
              </div>
            </div>

            <div className="bright">
              <p>{item.description?.substring(0, 100)}</p>
              <BookmarkRemoveOutlinedIcon className="deleteBookmark" onClick={(e) => { deleteBookmark(e,item.id)}}/>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Bookmarks;
