import React from 'react'

import SidePanel from '../../components/chatComponents/sidePanel/SidePanel'
import MessagingPanel from '../../components/chatComponents/messagingPanel/MessagingPanel'

import './chat.scss'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="container">
        <SidePanel/>
        <MessagingPanel/>
      </div>
    </div>
  )
}

export default Chat