import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import './sidebar.scss'

const Sidebar = () => {
  const {currentUser} = useContext(AuthContext)


  return (
    <div className='sidebar'>
      
      {window.location.pathname.includes('/up/C') &&
        <div className="links">
          <Link className='link' to=''>
            <h4>Profile page</h4>
          </Link>
        </div>
      }
      
      {(window.location.pathname.includes('/up/V') || window.location.pathname.includes('/addproduct') || window.location.pathname.includes('/manage') || window.location.pathname.includes('/reported')) &&
        <div className="links">

          <Link className='link' to={`/up/${currentUser.id}`}>
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
          
        </div>
      }
    </div>
  )
}

export default Sidebar