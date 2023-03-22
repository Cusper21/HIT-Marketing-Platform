import React, { useContext, useEffect, useState} from 'react'
import Message from '../message/Message'
import InputPanel from '../inputPanel/InputPanel'

import './messagingPanel.scss'
import { ChatContext } from './../../../context/chatContext'
import { makeRequest } from '../../../axios'

const MessagingPanel = () => {

  const {chatUser} = useContext(ChatContext)

  const[messages, setMessages] = useState()

    const m = async ()=>{
        await makeRequest.post("/chats/messages", chatUser).then((res) => {
          setMessages(res.data)
        })
      }

  useEffect( () => {  
    chatUser && m()
  })

  return (
    <div className='messagingPanel'>
      <div className="top">
        <img src={chatUser?.user_image} alt="" />
        <h4>{chatUser?.user_name}</h4>
      </div>
      
      <div className="messages">

      {messages?.map(message=>(
          <Message message= {message} key={message.id}/>
          )
        )}
        
      </div>
      <InputPanel/>
    </div>
  )
}

export default MessagingPanel