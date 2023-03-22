import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

import './profile.scss'

const Profile = () => {

    const {currentUser} = useContext(AuthContext)

  return (
    <div className='profile'>
        <div className="container">
            <div className='catImage'>
                <img src={currentUser.profile_picture} alt="" />
                <button>
                Change Profile Picture
                </button>
            </div>
            <div className="userInfo">
                {window.location.pathname.includes('/up/C') && 
                    <form action=""  >
                        <input type="text" placeholder="Enter Firstname" />
                        <input type="text" placeholder="Enter Surname"/>
                        <input type="date" placeholder="Enter D.O.B"/>
                        <input type="menu" placeholder="Enter Gender"/>
                        <input type="email" placeholder="Enter Email"/>
                        <input type="text" placeholder="Enter Username"/>
                        <button>
                        Save
                        </button>
                    </form>
                }

                {window.location.pathname.includes('/up/V') && 
                    <form action="">
                        <input type="text" placeholder="Enter Company Name"/>
                        <input type="text" placeholder="Enter Address"/>
                        <input type="text" placeholder="Enter Type"/>
                        <input type="email" placeholder="Enter Email"/>
                        <input type="text" placeholder="Enter Username"/>
                        
                        <button>
                        Submit
                        </button>
                    </form>
                }
            </div>
            
            <button>
                Delete Account
            </button>
        </div>
        
    </div>
  )
}

export default Profile