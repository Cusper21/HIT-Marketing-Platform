import React, { useContext, useEffect, useRef, useState} from 'react'
import Message from '../message/Message'
import InputPanel from '../inputPanel/InputPanel'

import './messagingPanel.scss'
import { ChatContext } from './../../../context/chatContext'
import { makeRequest } from '../../../axios'
import { Chip, Divider } from '@mui/material'

const MessagingPanel = () => {

  const {chatUser} = useContext(ChatContext)

  const ref = useRef()

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  const[messages, setMessages] = useState([])

    const m = async ()=>{
        await makeRequest.post("/chats/messages", chatUser).then((res) => {
          setMessages(res.data)
        })
      }

      const groupedMessages = messages?.reduce((acc, message) => {
        const date = new Date(message?.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(message);
        return acc;
      }, {});
      
      // Sort dates
      const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(b) - new Date(a));
      

  useEffect( () => {  
    chatUser && m()
  })

  return (
    <div ref={ref} className='messagingPanel'>
      <div className="top">
        <img src={chatUser?.user_image} alt="" />
        <h4>{chatUser?.user_name}</h4>
      </div>
      
      <div className="messages">

      {Object.keys(groupedMessages).length > 0 && sortedDates?.map((date, index) => (
  <div key={date}>
    {index > 0 && <div>
                <Divider className='divider' style={{  }}>
                  <Chip label={date} />
                </Divider>
              </div>} 
    
    {groupedMessages[date].map((message) => (
      <Message key={message?.date} message={message}/>
    ))}
  </div>
))}
        
      </div>
      <InputPanel/>
    </div>
  )
}

export default MessagingPanel