import React from 'react'
import { Link } from 'react-router-dom'
import './bookmarks.scss'

const Bookmarks = () => {
  return (
    <div>
        <h3>My Bookmarks</h3>
        <Link to={``}>
            <div className="left">
                <img src="" alt="" />
                <div className="content">
                    <h4>Name</h4>
                    <h4>$99.99</h4>
                </div>
            </div>
            <div className="right">
                <p>Description</p>
            </div>
        </Link>
    </div>
  )
}

export default Bookmarks