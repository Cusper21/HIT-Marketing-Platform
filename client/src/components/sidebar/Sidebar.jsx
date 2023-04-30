import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import './sidebar.scss'

const Sidebar = () => {
  const {currentUser} = useContext(AuthContext)


  return (
    <div className='sidebar'>
      
      {currentUser.id.includes('C') &&
        <div className="links">
          <Link className='link' to={`/up`}>
            <h4>Profile page</h4>
          </Link>
          <Link className='link' to={`/up/bookmarks`}>
            <h4>Bookmarks</h4>
          </Link>
          <Link className='link' to={`/up/changepassword`}>
            <h4>Change Password</h4>
          </Link>
        </div>
      }
      
      {currentUser.id.includes('V') &&
        <div className="links">

          <Link className='link' to={`/up/vendor`}>
            <h4>Profile page</h4>
          </Link>

          <Link className='link' to='/up/addproduct'>
            <h4>Add Product</h4>
          </Link>

          <Link className='link' to='/up/manage'>
            <h4>Manage Products</h4>
          </Link>

          <Link className='link' to='/up/reported'>
            <h4>Reported Products</h4>
          </Link>

          <Link className='link' to={`/up/changepassword`}>
            <h4>Change Password</h4>
          </Link>
          
        </div>
      }

      {currentUser.id.includes('A') &&
        <div className="links">

          <Link className='link' to={`/up`}>
            <h4>Dash Board</h4>
          </Link>

          <Link className='link' to='/up/manageusers'>
            <h4>Manage Users</h4>
          </Link>

          <Link className='link' to='/up/manageproducts'>
            <h4>Manage Products</h4>
          </Link>

          <Link className='link' to={`/up/changepassword`}>
            <h4>Change Password</h4>
          </Link>
        </div>
      }


      


    </div>
  )
}

export default Sidebar