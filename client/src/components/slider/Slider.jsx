import React, { useContext } from 'react'

import './slider.scss'
import { AuthContext } from '../../context/authContext';

const Slider = () => {

    const{currentUser} = useContext(AuthContext)

    const data = [
        'https://images.unsplash.com/photo-1585914924626-15adac1e6402?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80'
    ];

  return (
    <div className='slider'>
        <div className="container">
            <img src={data[0]} alt="" />
        </div>
        
        <div className="overlay">
            <div className="info">
                <h2>HIT Marketing Platform</h2>
                {currentUser?.id.includes('V') ? 
                <p>Connecting customers and businesses for success. Bridging the gap and building stronger connections. Unlock the potential of your brand with our powerful network.
                </p>
                : <p>Bringing the market closer to you. Bridging a gap. Bringing convinience.
                </p>}
                

            </div>
        </div>
    </div>
  )
}

export default Slider