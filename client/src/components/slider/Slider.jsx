import React, {useState} from 'react'

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import './slider.scss'

const Slider = () => {

    const data = [
        'https://images.unsplash.com/photo-1585914924626-15adac1e6402?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=901&q=80',
        'https://images.unsplash.com/photo-1463620910506-d0458143143e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGFjY29tb2RhdGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    ];

    const [currentSlide, setCurrentSlide] = useState(0)

    const prevSlide = () => {
        setCurrentSlide( currentSlide === 0 ? 2 : (prev) => prev-1)

    }
    const nextSlide = () => {
        setCurrentSlide( currentSlide === 2 ? 0 : (prev) => prev+1)
    }

  return (
    <div className='slider'>

        <div className="container" style={{transform:`translateX(-${currentSlide * 90}vw)`}}>
            <img src={data[0]} alt="" />
            <img src={data[1]} alt="" />
            <img src={data[2]} alt="" />
        </div>

        <div className="icons">
            <div className="icon" onClick={prevSlide}>
                <ArrowBackIosRoundedIcon/>
            </div>
            <div className="icon" onClick={nextSlide}>
                <ArrowForwardIosRoundedIcon/>
            </div>
        </div>
        
        <div className="overlay">
           
        </div>
    </div>
  )
}

export default Slider