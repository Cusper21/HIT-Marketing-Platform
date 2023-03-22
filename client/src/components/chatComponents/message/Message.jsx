import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../../context/authContext'

import './message.scss'

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext)
  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', inline: 'start'})
  },[message])

  return (
    <div ref={ref} className={`message ${message.sender_id === currentUser.id && "owner"}`}>
      <div className="contents">
        <p>{message.message}</p>
        <span>{message.date}</span>
      </div>
    </div>
  )
}

export default Message