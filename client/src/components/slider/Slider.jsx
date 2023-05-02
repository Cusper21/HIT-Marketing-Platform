import React from 'react'

import './slider.scss'

const Slider = () => {

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
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae optio pariatur accusantium inventore excepturi aspernatur mollitia distinctio quibusdam quisquam sed asperiores, provident omnis culpa. Iure ut error et non laborum.
                </p>

            </div>
        </div>
    </div>
  )
}

export default Slider