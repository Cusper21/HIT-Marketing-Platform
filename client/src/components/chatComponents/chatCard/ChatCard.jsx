import React, { useContext} from 'react'
import { ChatContext } from '../../../context/chatContext';

import './chatCard.scss'

const ChatCard = ({chat}) => {
  const {setChatUser, ref} = useContext(ChatContext)

  const handleClick = (chat)=>{
    setChatUser(chat)
    if(ref){ref.current.scrollTop = ref.current.scrollHeight;}
  }
  
  return (
    <div className='chatCard' onClick={() => handleClick(chat)}>
      <img src={chat.user_image} alt="" />
      
      <div className="text">
        <h5>{chat.user_name}</h5>
        <span>{chat.last_message}</span>
      </div>
      
    </div>
  )
}

export default ChatCard