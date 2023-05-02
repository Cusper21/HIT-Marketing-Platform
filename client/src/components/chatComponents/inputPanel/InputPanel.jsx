import React, { useContext, useState } from 'react'

import './inputPanel.scss'
import { ChatContext } from './../../../context/chatContext'
import { AuthContext } from './../../../context/authContext';
import { makeRequest } from '../../../axios'


const InputPanel = () => {

  const {chatUser} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  const [message,setMessage] = useState(null);

  const m = async ()=>{
    await  makeRequest.post("/chats/send", {user_id:chatUser.user_id, message:message, id:currentUser.id, name:currentUser.name,image:currentUser.profile_picture}).then((res) => {
      return res.data
    })
  }

  const handleChange = (e)=>{
    setMessage(e.target.value)
  }

  const handleClick = (e)=>{
    e.preventDefault()
    m()
  }

  return (
    <div className='inputPanel'>
      <input type="text" name="" id="" placeholder='Type message' onChange={handleChange} required disabled={(currentUser && chatUser) ? false: true}/>
      <button onClick={handleClick} disabled={(currentUser && chatUser && message) ? false: true}>Send</button>
    </div>
  )
}

export default InputPanel