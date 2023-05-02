import React from 'react'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import './search.scss'

const Search = () => {
  return (
    <div className='search'>

      <div className="input">
        <SearchRoundedIcon/>
        <input type="text" maxLength={20} placeholder='Find User'/>
      </div>

      <div className="results">
        <img src="https://images.unsplash.com/photo-1476657680631-c07285ff2581?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29uJTIwcG90cmFpdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="" />
        <div className="text">
          <h5>Name</h5>
        </div>
      </div>

    </div>
  )
}

export default Search