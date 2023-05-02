import React, { useContext, useRef } from 'react'
import { AuthContext } from '../../../context/authContext'
import moment from "moment"

import './message.scss'

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext)
  const ref = useRef()

  return (
    <div ref={ref} className={`message ${message.sender_id === currentUser.id && "owner"}`}>
      <div className="contents">
        <p>{message.message}</p>
        <span>{ moment(message.date).format('HH:mm') }</span>
      </div>
    </div>
  )
}

export default Message